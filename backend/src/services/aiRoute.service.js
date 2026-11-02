import OpenAI from "openai";
import { config } from "../config/env.js";
import { allLocations, nearbyPlaces } from "../../shared/mockData.js";
import { haversineKm, isValidCoords, toLatLon } from "./geo.service.js";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const ALLOWED_ICONS = new Set(["nature", "food", "stay"]);
const MAX_DAYS = 7;
const ALMATY = [43.2389, 76.8897];

/** Каталог мест (без дублей по названию) — им пользуются и Groq, и демо-генератор. */
export const CATALOG = (() => {
    const seen = new Set();
    return [...allLocations, ...nearbyPlaces].filter((l) => {
        if (seen.has(l.name) || !isValidCoords(l.coords)) return false;
        seen.add(l.name);
        return true;
    });
})();

const LANG_NAMES = { РУС: "русский", ҚАЗ: "казахский", ENG: "английский" };

// Перевод тегов (приходят с фронтенда на русском) для заголовка демо-маршрута
const TAG_NAMES = {
    ҚАЗ: { Природа: "Табиғат", История: "Тарих", Культура: "Мәдениет", Еда: "Тағам", Горы: "Таулар", Озёра: "Көлдер" },
    ENG: { Природа: "Nature", История: "History", Культура: "Culture", Еда: "Food", Горы: "Mountains", Озёра: "Lakes" },
};
const tagLabel = (lang, tag) => TAG_NAMES[lang]?.[tag] ?? tag;

// ─── Разбор пожеланий ─────────────────────────────────────────────

/** Количество дней: preferences.days или строка вида "3д"; 1…7. */
export function resolveDays(preferences = {}) {
    let n = Number(preferences.days);
    if (!Number.isFinite(n)) {
        const m = String(preferences.duration || "").match(/\d+/);
        n = m ? Number(m[0]) : 1;
    }
    return Math.min(Math.max(Math.round(n) || 1, 1), MAX_DAYS);
}

/** Очищаем пожелания от мусора, чтобы не отправлять в модель что попало. */
export function sanitizePreferences(preferences = {}) {
    const tags = Array.isArray(preferences.tags)
        ? preferences.tags.filter((t) => typeof t === "string").map((t) => t.slice(0, 30)).slice(0, 10)
        : [];
    const budget = ["low", "medium", "high"].includes(preferences.budget) ? preferences.budget : "medium";
    const lang = LANG_NAMES[preferences.lang] ? preferences.lang : "РУС";
    const region = typeof preferences.region === "string" ? preferences.region.slice(0, 60) : "Казахстан";
    return {
        tags,
        days: resolveDays(preferences),
        budget,
        lang,
        region,
        accessibility: Boolean(preferences.accessibility),
    };
}

// ─── Нормализация ответа модели ───────────────────────────────────

const normalizeName = (s) =>
    String(s || "").toLowerCase().replace(/ё/g, "е").replace(/[«»"'().,:;!?—–-]/g, " ").replace(/\s+/g, " ").trim();

function findCatalogPlace({ locId, title }) {
    if (locId != null) {
        const byId = CATALOG.find((l) => l.id === Number(locId));
        if (byId) return byId;
    }
    const t = normalizeName(title);
    if (t.length < 4) return null;
    return CATALOG.find((l) => {
        const n = normalizeName(l.name);
        return n === t || (n.length >= 4 && (t.includes(n) || n.includes(t)));
    }) || null;
}

const TIME_RE = /^([01]?\d|2[0-3]):[0-5]\d$/;

export function normalizeItems(items, days = 1) {
    if (!Array.isArray(items)) return null;
    let prevDay = 1;
    return items.slice(0, days * 8).map((it, i) => {
        const raw = it && typeof it === "object" ? it : {};
        let day = Number.parseInt(raw.day, 10);
        if (!Number.isFinite(day)) day = prevDay;
        day = Math.min(Math.max(day, prevDay), days); // дни не убывают
        prevDay = day;

        const title = String(raw.title || `Остановка ${i + 1}`).slice(0, 120);
        const place = findCatalogPlace({ locId: raw.locId, title });
        const modelCoords = toLatLon(
            raw.coords ?? (raw.lat != null && raw.lon != null ? [raw.lat, raw.lon] : null)
        );
        const coords = place
            ? place.coords
            : isValidCoords(modelCoords)
                ? [Number(modelCoords[0].toFixed(4)), Number(modelCoords[1].toFixed(4))]
                : undefined;

        return {
            day,
            time: typeof raw.time === "string" && TIME_RE.test(raw.time.trim())
                ? raw.time.trim().padStart(5, "0")
                : `${String(9 + (i % 10)).padStart(2, "0")}:00`,
            title,
            subtitle: String(raw.subtitle || "").slice(0, 160),
            duration: typeof raw.duration === "string" ? raw.duration.slice(0, 20) : "1ч",
            icon: ALLOWED_ICONS.has(raw.icon) ? raw.icon : "nature",
            ...(place ? { locId: place.id } : {}),
            ...(coords ? { coords } : {}),
        };
    });
}

function stripJsonFence(text) {
    const t = text.trim();
    const m = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (m) return m[1].trim();
    // На случай текста вокруг JSON — берём от первой { до последней }
    const start = t.indexOf("{");
    const end = t.lastIndexOf("}");
    return start >= 0 && end > start ? t.slice(start, end + 1) : t;
}

export function parseGroqRouteJson(text, days = 1) {
    if (!text || typeof text !== "string") return null;
    let data;
    try {
        data = JSON.parse(stripJsonFence(text));
    } catch {
        return null;
    }
    if (!data || typeof data.title !== "string" || !Array.isArray(data.items)) return null;
    const items = normalizeItems(data.items, days);
    if (!items?.length) return null;
    return { title: data.title.trim().slice(0, 200), items, isAI: true, source: "groq" };
}

// ─── Демо-маршрут (без ключа Groq или при ошибке) ─────────────────

const MOCK_TEXT = {
    РУС: {
        title: (tags, days) => `${tags.length ? tags.join(", ") : "Казахстан"}: ${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"}`,
        breakfast: "Завтрак", breakfastSub: "Местная кухня",
        lunch: "Обед", lunchSub: "Национальные блюда",
        dinner: "Ужин", dinnerSub: "Бешбармак и чай",
        stay: "Ночёвка", staySub: "Гостевой дом рядом",
        near: "рядом:",
    },
    ҚАЗ: {
        title: (tags, days) => `${tags.length ? tags.join(", ") : "Қазақстан"}: ${days} күн`,
        breakfast: "Таңғы ас", breakfastSub: "Жергілікті ас",
        lunch: "Түскі ас", lunchSub: "Ұлттық тағамдар",
        dinner: "Кешкі ас", dinnerSub: "Бешбармақ пен шай",
        stay: "Түнеу", staySub: "Жақын қонақ үй",
        near: "маңы:",
    },
    ENG: {
        title: (tags, days) => `${tags.length ? tags.join(", ") : "Kazakhstan"}: ${days} day${days === 1 ? "" : "s"}`,
        breakfast: "Breakfast", breakfastSub: "Local cuisine",
        lunch: "Lunch", lunchSub: "National dishes",
        dinner: "Dinner", dinnerSub: "Beshbarmak and tea",
        stay: "Overnight", staySub: "Guesthouse nearby",
        near: "near",
    },
};

/**
 * Строит правдоподобный маршрут из каталога: места по тегам, порядок — «ближайший сосед»
 * от Алматы, по 2 места в день, с завтраком, обедом и ночёвкой.
 */
export function mockFromPreferences(preferences = {}) {
    const { tags, days, lang } = sanitizePreferences(preferences);
    const tx = MOCK_TEXT[lang];
    const wanted = new Set(tags.map((t) => t.replace(/ё/g, "е")));
    const matchesTags = (l) => wanted.size === 0 || l.tags.some((t) => wanted.has(t.replace(/ё/g, "е")));

    const pool = CATALOG.filter((l) => l.id !== 1);
    const need = days * 2;

    // Жадный обход «ближайший сосед»: сначала места по интересам, если их мало — добираем любыми
    const ordered = [];
    let cur = ALMATY;
    const walk = (list) => {
        const left = [...list];
        while (ordered.length < need && left.length) {
            left.sort((x, y) => haversineKm(cur, x.coords) - haversineKm(cur, y.coords));
            const next = left.shift();
            ordered.push(next);
            cur = next.coords;
        }
    };
    const matched = pool.filter(matchesTags);
    walk(matched);
    walk(pool.filter((l) => !matched.includes(l)));

    const items = [];
    let lastCoords = ALMATY;
    for (let d = 1; d <= days; d++) {
        const [a, b] = ordered.slice((d - 1) * 2, d * 2);
        if (!a) break;
        items.push({ day: d, time: "08:30", title: tx.breakfast, subtitle: tx.breakfastSub, duration: "1ч", icon: "food", coords: lastCoords });
        items.push({ day: d, time: "10:00", title: a.name, subtitle: a.subtitle, duration: "3ч", icon: "nature", locId: a.id, coords: a.coords });
        items.push({ day: d, time: "13:30", title: tx.lunch, subtitle: `${tx.lunchSub} · ${tx.near} ${a.name}`, duration: "1ч", icon: "food", coords: a.coords });
        lastCoords = a.coords;
        if (b) {
            items.push({ day: d, time: "15:30", title: b.name, subtitle: b.subtitle, duration: "2.5ч", icon: "nature", locId: b.id, coords: b.coords });
            lastCoords = b.coords;
        }
        items.push(
            d < days
                ? { day: d, time: "19:30", title: tx.stay, subtitle: tx.staySub, duration: "—", icon: "stay", coords: lastCoords }
                : { day: d, time: "19:00", title: tx.dinner, subtitle: tx.dinnerSub, duration: "1.5ч", icon: "food", coords: lastCoords }
        );
    }

    return {
        title: tx.title(tags.map((t) => tagLabel(lang, t)), days),
        items,
        isAI: true,
        source: "demo",
    };
}

// ─── Groq ─────────────────────────────────────────────────────────

function groqClient() {
    if (!config.groqApiKey) return null;
    return new OpenAI({ apiKey: config.groqApiKey, baseURL: GROQ_BASE_URL });
}

export function buildPrompt(prefs) {
    const catalog = CATALOG.map((l) => ({
        locId: l.id,
        name: l.name,
        tags: l.tags,
        lat: l.coords[0],
        lon: l.coords[1],
    }));
    const perDay = prefs.days === 1 ? "4–7 пунктов" : `${prefs.days} дней, по 4–6 пунктов в день`;

    return `Ты туристический ассистент приложения Sapar (Казахстан).

Верни ТОЛЬКО один JSON-объект без пояснений и без markdown, строго в формате:
{"title":"краткое название маршрута","items":[{"day":1,"time":"ЧЧ:ММ","title":"название точки","subtitle":"короткое описание","duration":"Nч или —","icon":"nature|food|stay","locId":5,"lat":43.35,"lon":79.07}]}

Требования:
- ${perDay}; поле day — номер дня от 1 до ${prefs.days}, пункты идут по порядку;
- время внутри дня возрастает, учитывай реальное время в дороге между точками;
- соседние точки должны быть географически близко, без бессмысленных переездов через всю страну;
- icon только: nature, food, stay; в многодневном маршруте каждый день, кроме последнего, заканчивается пунктом stay;
- если точка есть в каталоге ниже — укажи её locId и координаты из каталога; иначе locId не указывай, а lat/lon дай приблизительно;
- язык всех текстов: ${LANG_NAMES[prefs.lang]};
- учитывай интересы, бюджет (low — до 20 000 ₸, medium — 20–50 000 ₸, high — от 50 000 ₸) и доступность.

Пожелания (JSON):
${JSON.stringify(prefs)}

Каталог мест Sapar (JSON):
${JSON.stringify(catalog)}`;
}

/**
 * Генерация маршрута по пожеланиям (Groq Responses API, модель по умолчанию openai/gpt-oss-20b).
 * Без ключа или при ошибке модели — демо-маршрут из каталога.
 */
export async function generateAIRouteFromPreferences(preferences = {}) {
    const prefs = sanitizePreferences(preferences);
    const client = groqClient();
    if (!client) return mockFromPreferences(prefs);

    try {
        const response = await client.responses.create({
            model: config.groqModel,
            input: buildPrompt(prefs),
        });
        const parsed = parseGroqRouteJson(response.output_text, prefs.days);
        if (parsed) return parsed;
        console.warn("Groq AI route: не удалось разобрать ответ модели, отдаём демо-маршрут");
    } catch (err) {
        console.error("Groq AI route:", err.message);
    }
    return mockFromPreferences(prefs);
}

/** Совместимость: короткий вызов по тегам и региону. */
export const generateRoute = async ({ tags = [], region = "Казахстан" }) =>
    generateAIRouteFromPreferences({ tags, region });
