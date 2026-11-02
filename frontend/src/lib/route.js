import { routeDistanceKm } from "./geo.js";

/** Парсит "2ч", "1.5ч", "1ч 30мин", "30мин", "2h", "—" → число часов (float). */
export const parseDurationHours = (str) => {
    if (!str || typeof str !== "string") return 0;
    const s = str.toLowerCase().replace(/\s+/g, "").replace(",", ".");
    if (s === "—" || s === "-" || s === "") return 0;
    const hourRe = /(\d+(?:\.\d+)?)(сағ|час|ч|h)/;
    const h = s.match(hourRe);
    const rest = h ? s.replace(hourRe, "") : s;
    const m = rest.match(/(\d+(?:\.\d+)?)(мин|min|м|m)/);
    const hours = h ? parseFloat(h[1]) : 0;
    const mins = m ? parseFloat(m[1]) : 0;
    return hours + mins / 60;
};

/** "09:30" → 570 (минуты от полуночи) или null. */
export const timeToMinutes = (time) => {
    const m = String(time || "").match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    return Number(m[1]) * 60 + Number(m[2]);
};

export const minutesToTime = (mins) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

/** Номер дня пункта (по умолчанию 1). */
export const itemDay = (it) => (Number.isInteger(it?.day) && it.day > 0 ? it.day : 1);

/** Количество дней в маршруте: максимум поля day, минимум 1. */
export const countDays = (items = []) =>
    items.reduce((max, it) => Math.max(max, itemDay(it)), 1);

/** Группирует пункты по дням с сохранением порядка: [{ day, items: [{ item, index }] }]. */
export const groupByDay = (items = []) => {
    const groups = [];
    items.forEach((item, index) => {
        const day = itemDay(item);
        let g = groups.find((x) => x.day === day);
        if (!g) {
            g = { day, items: [] };
            groups.push(g);
        }
        g.items.push({ item, index });
    });
    return groups.sort((a, b) => a.day - b.day);
};

/**
 * Время и день следующего пункта: после последнего пункта + его длительность
 * + 30 мин на дорогу, с округлением до получаса. Позже 21:00 — переносим на
 * следующий день в 09:00.
 */
export const nextSlot = (items = []) => {
    const last = items[items.length - 1];
    if (!last) return { time: "09:00", day: 1 };
    const start = timeToMinutes(last.time) ?? 9 * 60;
    const dur = Math.round(parseDurationHours(last.duration) * 60) || 60;
    const next = Math.ceil((start + dur + 30) / 30) * 30;
    if (next > 21 * 60) return { time: "09:00", day: itemDay(last) + 1 };
    return { time: minutesToTime(next), day: itemDay(last) };
};

// Ориентировочные цены, ₸
const COST_BY_ICON = { food: 4000, stay: 15000, nature: 2500, added: 2500 };
const FUEL_PER_KM = 30; // бензин на машину ≈ 8 л/100 км × ~370 ₸

/**
 * Сводка маршрута: расстояние по координатам (Haversine × дорожный коэффициент),
 * время пребывания, ориентировочный бюджет. Если координат нет — грубая оценка
 * 40 км между остановками.
 */
export const computeSummary = (items = []) => {
    const stops = items.length;
    if (stops === 0) return { distanceKm: 0, measured: false, hours: 0, budget: 0 };

    const hours = items.reduce((sum, it) => sum + parseDurationHours(it.duration), 0);

    let { km, measured } = routeDistanceKm(items);
    if (!measured) km = Math.max(0, (stops - 1) * 40);

    const placesCost = items.reduce((sum, it) => sum + (COST_BY_ICON[it.icon] ?? 2500), 0);
    const budget = Math.round((placesCost + km * FUEL_PER_KM) / 1000) * 1000;

    return { distanceKm: km, measured, hours, budget };
};
