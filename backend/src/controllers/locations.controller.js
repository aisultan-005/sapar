import { allLocations, nearbyPlaces } from "../../shared/mockData.js";

export const getLocations = (req, res) => {
    const { tag, search } = req.query;

    let result = allLocations;

    if (search) {
        const q = search.toLowerCase();
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
    const loc = allLocations.find((l) => l.id === Number(req.params.id));
    if (!loc) return res.status(404).json({ error: "Not found" });
    res.json({ data: loc });
};

export const getNearbyLocations = (req, res) => {
    // В будущем: принять lat/lon и считать дистанцию
    res.json({ data: nearbyPlaces });
};
