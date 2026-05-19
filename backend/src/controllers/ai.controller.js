import { generateAIRouteFromPreferences } from "../services/aiRoute.service.js";

export const generateAIRoute = async (req, res) => {
    try {
        const { preferences = {} } = req.body;
        const route = await generateAIRouteFromPreferences(preferences);
        res.json({
            data: {
                id: Date.now(),
                ...route,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
