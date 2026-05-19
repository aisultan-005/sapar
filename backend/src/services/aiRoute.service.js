import OpenAI from "openai";
import { config } from "../config/env.js";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

const MOCK_ROUTES = {
    nature: [
        { time: "09:00", title: "Чарынский каньон", subtitle: "Гранд-Каньон Казахстана", duration: "3ч", icon: "nature" },
        { time: "13:00", title: "Обед у реки Чарын", subtitle: "Пикник с видом", duration: "1ч", icon: "food" },
        { time: "15:00", title: "Кольсайские озёра", subtitle: "Жемчужины Тянь-Шаня", duration: "3ч", icon: "nature" },
        { time: "19:00", title: "Юрточный лагерь", subtitle: "Ночёвка под звёздами", duration: "—", icon: "stay" },
    ],
    history: [
        { time: "09:00", title: "Мавзолей Яссауи", subtitle: "UNESCO объект", duration: "2ч", icon: "nature" },
        { time: "12:00", title: "Базар Туркестана", subtitle: "Местная кухня", duration: "1ч", icon: "food" },
        { time: "14:00", title: "Городище Сауран", subtitle: "Древний шёлковый путь", duration: "2ч", icon: "nature" },
    ],
};

const ALLOWED_ICONS = new Set(["nature", "food", "stay"]);

function groqClient() {
    if (!config.groqApiKey) return null;
    return new OpenAI({
        apiKey: config.groqApiKey,
        baseURL: GROQ_BASE_URL,
    });
}

function mockFromPreferences(preferences = {}) {
    const tags = preferences.tags || [];
    const region = preferences.region || "Алматинская область";
    const key = tags.includes("История") ? "history" : "nature";
    return {
        title: `AI-маршрут: ${region}`,
        items: MOCK_ROUTES[key],
        isAI: true,
    };
}

function stripJsonFence(text) {
    const t = text.trim();
    const m = t.match(/^```(?:json)?\s*([\s\S]*?)```$/im);
    return m ? m[1].trim() : t;
}

function normalizeItems(items) {
    if (!Array.isArray(items)) return null;
    return items.map((it, i) => ({
        time: typeof it.time === "string" && it.time ? it.time : `${String(9 + i).padStart(2, "0")}:00`,
        title: String(it.title || `Остановка ${i + 1}`).slice(0, 120),
        subtitle: String(it.subtitle || "").slice(0, 160),
        duration: typeof it.duration === "string" ? it.duration : "1ч",
        icon: ALLOWED_ICONS.has(it.icon) ? it.icon : "nature",
    }));
}

function parseGroqRouteJson(text) {
    if (!text || typeof text !== "string") return null;
    let data;
    try {
        data = JSON.parse(stripJsonFence(text));
    } catch {
        return null;
    }
    if (!data || typeof data.title !== "string" || !Array.isArray(data.items)) return null;
    const items = normalizeItems(data.items);
    if (!items?.length) return null;
    return { title: data.title.trim().slice(0, 200), items, isAI: true };
}

/**
 * Генерация дневного маршрута по пожеланиям (Groq Responses API, модель по умолчанию openai/gpt-oss-20b).
 */
export async function generateAIRouteFromPreferences(preferences = {}) {
    const client = groqClient();
    if (!client) return mockFromPreferences(preferences);

    const payload = JSON.stringify(preferences, null, 2);
    const input = `Ты туристический ассистент приложения Sapar (Казахстан).

Верни ТОЛЬКО один JSON-объект без пояснений и без markdown, строго в формате:
{"title":"краткое название маршрута","items":[{"time":"ЧЧ:ММ","title":"название точки","subtitle":"короткое описание","duration":"Nч или —","icon":"nature|food|stay"}]}

Требования:
- 4–7 пунктов, один календарный день, логичные по времени интервалы;
- icon только: nature, food, stay;
- язык: русский;
- учитывай регион, бюджет, длительность и доступность из данных ниже.

Пожелания (JSON):
${payload}`;

    try {
        const response = await client.responses.create({
            model: config.groqModel,
            input,
        });
        const text = response.output_text;
        const parsed = parseGroqRouteJson(text);
        if (parsed) return parsed;
    } catch (err) {
        console.error("Groq AI route:", err.message);
    }
    return mockFromPreferences(preferences);
}

/** Совместимость: короткий вызов по тегам и региону. */
export const generateRoute = async ({ tags = [], region = "almaty" }) =>
    generateAIRouteFromPreferences({ tags, region });
