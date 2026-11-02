import { generateAIRouteFromPreferences } from "../services/aiRoute.service.js";

export const generateAIRoute = async (req, res, next) => {
    try {
        const preferences = req.body?.preferences;
        if (preferences != null && (typeof preferences !== "object" || Array.isArray(preferences))) {
            return res.status(400).json({ error: "preferences must be an object" });
        }
        const route = await generateAIRouteFromPreferences(preferences || {});
        res.json({
            data: {
                id: Date.now(),
                ...route,
            },
        });
    } catch (err) {
        next(err);
    }
};
