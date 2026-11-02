import { allLocations, nearbyPlaces } from "../data/locations.js";

/** Коэффициент «дорога длиннее прямой»: по горным трассам Казахстана ~1.25–1.35. */
export const ROAD_FACTOR = 1.3;

const toRad = (deg) => (deg * Math.PI) / 180;

/** Формула гаверсинуса — расстояние по прямой между двумя точками, км. */
export const haversineKm = ([lat1, lon1], [lat2, lon2]) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/** Проверяет, что координаты — пара чисел примерно в пределах Казахстана. */
export const isValidCoords = (c) =>
    Array.isArray(c) &&
    c.length === 2 &&
    Number.isFinite(c[0]) &&
    Number.isFinite(c[1]) &&
    c[0] >= 39 && c[0] <= 57 &&
    c[1] >= 45 && c[1] <= 89;

const normalize = (s) =>
    String(s || "")
        .toLowerCase()
        .replace(/ё/g, "е")
        .replace(/[«»"'().,:;!?—–-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const CATALOG = [...allLocations, ...nearbyPlaces];

/** Ищет место из каталога по id или по названию (включение строки в обе стороны). */
export const findLocation = ({ locId, title } = {}) => {
    if (locId != null) {
        const byId = CATALOG.find((l) => l.id === Number(locId));
        if (byId) return byId;
    }
    const t = normalize(title);
    if (t.length < 4) return null;
    return (
        CATALOG.find((l) => normalize(l.name) === t) ||
        CATALOG.find((l) => {
            const n = normalize(l.name);
            return n.length >= 4 && (t.includes(n) || n.includes(t));
        }) ||
        null
    );
};

/** Дополняет пункт маршрута координатами (и locId), если их можно определить. */
export const enrichItem = (item) => {
    if (isValidCoords(item.coords)) return item;
    const loc = findLocation(item);
    if (!loc || !isValidCoords(loc.coords)) return item;
    return { ...item, coords: loc.coords, locId: item.locId ?? loc.id };
};

/**
 * Длина маршрута по дорогам (приблизительно): сумма отрезков между соседними
 * пунктами с координатами × ROAD_FACTOR. Возвращает { km, measured } —
 * measured=false, если координат не хватило ни на один отрезок.
 */
export const routeDistanceKm = (items = []) => {
    const points = items.map((it) => it.coords).filter(isValidCoords);
    if (points.length < 2) return { km: 0, measured: false };
    let km = 0;
    for (let i = 1; i < points.length; i++) {
        km += haversineKm(points[i - 1], points[i]);
    }
    return { km: Math.round(km * ROAD_FACTOR), measured: true };
};

/** "2.3 км" / "850 м" */
export const formatDistance = (km) =>
    km < 1 ? `${Math.round(km * 1000)} м` : km < 10 ? `${km.toFixed(1)} км` : `${Math.round(km)} км`;
