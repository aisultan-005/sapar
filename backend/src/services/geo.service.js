/**
 * Геоутилиты. Координаты в проекте хранятся как массив [lat, lon]
 * (так их использует Leaflet на фронтенде); объект { lat, lon } тоже поддерживается.
 */

export const toLatLon = (coords) => {
    if (Array.isArray(coords) && coords.length === 2) return [Number(coords[0]), Number(coords[1])];
    if (coords && typeof coords === "object") return [Number(coords.lat), Number(coords.lon)];
    return null;
};

/** Координаты — конечные числа примерно в пределах Казахстана. */
export const isValidCoords = (c) => {
    const p = toLatLon(c);
    return (
        !!p &&
        Number.isFinite(p[0]) && Number.isFinite(p[1]) &&
        p[0] >= 39 && p[0] <= 57 &&
        p[1] >= 45 && p[1] <= 89
    );
};

/** Формула гаверсинуса — расстояние между двумя точками на сфере, км. */
export const haversineKm = (a, b) => {
    const [lat1, lon1] = toLatLon(a);
    const [lat2, lon2] = toLatLon(b);
    const R = 6371;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

export const formatDistance = (km) =>
    km < 1 ? `${Math.round(km * 1000)} м` : km < 10 ? `${km.toFixed(1)} км` : `${Math.round(km)} км`;

/** Сортирует места по удалённости от пользователя; места без координат — в конце. */
export const sortByDistance = (places, userLat, userLon) =>
    places
        .map((p) => {
            if (!isValidCoords(p.coords)) return { ...p, distKm: null };
            const distKm = haversineKm([userLat, userLon], p.coords);
            return { ...p, distKm: Math.round(distKm * 10) / 10, dist: formatDistance(distKm) };
        })
        .sort((a, b) => (a.distKm ?? Infinity) - (b.distKm ?? Infinity));
