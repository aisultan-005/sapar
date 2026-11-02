import { allLocations, nearbyPlaces } from "../../shared/mockData.js";
import { sortByDistance } from "../services/geo.service.js";

export const getLocations = (req, res) => {
    const { tag, search } = req.query;

    let result = allLocations;

    if (search) {
        const q = String(search).toLowerCase();
        result = result.filter(
            (l) => l.name.toLowerCase().includes(q) || l.subtitle.toLowerCase().includes(q)
        );
    }

    if (tag) {
        result = result.filter((l) => l.tags.includes(tag));
    }

    res.json({ data: result });
};

export const getLocationById = (req, res) => {
    const id = Number(req.params.id);
    const loc = [...allLocations, ...nearbyPlaces].find((l) => l.id === id);
    if (!loc) return res.status(404).json({ error: "Not found" });
    res.json({ data: loc });
};

/**
 * GET /api/locations/nearby?lat=..&lon=..&limit=..
 * С координатами — все места, отсортированные по расстоянию (поле distKm/dist).
 * Без координат — подборка «рядом» для Алматы по умолчанию.
 */
export const getNearbyLocations = (req, res) => {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return res.json({ data: nearbyPlaces.slice(0, limit) });
    }
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
        return res.status(400).json({ error: "Invalid lat/lon" });
    }

    const seen = new Set();
    const unique = [...nearbyPlaces, ...allLocations].filter((p) => {
        if (seen.has(p.name)) return false;
        seen.add(p.name);
        return true;
    });

    res.json({ data: sortByDistance(unique, lat, lon).slice(0, limit) });
};
