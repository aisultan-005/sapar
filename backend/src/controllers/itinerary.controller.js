import Itinerary from "../models/Itinerary.model.js";
import { isMongoConnected } from "../config/mongo.connector.js";

const ensureDb = (res) => {
    if (!isMongoConnected()) {
        res.status(503).json({ error: "Database not configured. Set MONGO_URI on the server." });
        return false;
    }
    return true;
};

export const getUserItineraries = async (req, res, next) => {
    if (!ensureDb(res)) return;
    try {
        const items = await Itinerary.find({ userId: req.user?.id });
        res.json({ data: items });
    } catch (err) { next(err); }
};

export const saveItinerary = async (req, res, next) => {
    if (!ensureDb(res)) return;
    try {
        const doc = await Itinerary.create({
            ...req.body,
            userId: req.user?.id,
        });
        res.status(201).json({ data: doc });
    } catch (err) { next(err); }
};

export const deleteItinerary = async (req, res, next) => {
    if (!ensureDb(res)) return;
    try {
        await Itinerary.findOneAndDelete({
            _id: req.params.id,
            userId: req.user?.id,
        });
        res.json({ success: true });
    } catch (err) { next(err); }
};
