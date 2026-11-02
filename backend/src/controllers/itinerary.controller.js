import mongoose from "mongoose";
import Itinerary from "../models/Itinerary.model.js";
import { isMongoConnected } from "../config/mongo.connector.js";

const ensureDb = (res) => {
    if (!isMongoConnected()) {
        res.status(503).json({ error: "Database not configured. Set MONGO_URI on the server." });
        return false;
    }
    return true;
};

const ALLOWED_FIELDS = ["title", "region", "days", "items", "budget", "distance", "isAI"];

/** Берём из тела только разрешённые поля — userId и прочее клиент не задаёт. */
const pickItinerary = (body = {}) =>
    Object.fromEntries(ALLOWED_FIELDS.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));

export const getUserItineraries = async (req, res, next) => {
    if (!ensureDb(res)) return;
    try {
        const items = await Itinerary.find({ userId: req.user.id }).sort({ updatedAt: -1 });
        res.json({ data: items });
    } catch (err) { next(err); }
};

export const getItineraryById = async (req, res, next) => {
    if (!ensureDb(res)) return;
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "Invalid id" });
    }
    try {
        const doc = await Itinerary.findOne({ _id: req.params.id, userId: req.user.id });
        if (!doc) return res.status(404).json({ error: "Not found" });
        res.json({ data: doc });
    } catch (err) { next(err); }
};

export const saveItinerary = async (req, res, next) => {
    if (!ensureDb(res)) return;
    try {
        const doc = await Itinerary.create({
            ...pickItinerary(req.body),
            userId: req.user.id,
        });
        res.status(201).json({ data: doc });
    } catch (err) {
        if (err.name === "ValidationError") err.status = 400;
        next(err);
    }
};

export const deleteItinerary = async (req, res, next) => {
    if (!ensureDb(res)) return;
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "Invalid id" });
    }
    try {
        const doc = await Itinerary.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });
        if (!doc) return res.status(404).json({ error: "Not found" });
        res.json({ success: true });
    } catch (err) { next(err); }
};
