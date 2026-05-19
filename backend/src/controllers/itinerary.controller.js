import Itinerary from "../models/Itinerary.model.js";

export const getUserItineraries = async (req, res, next) => {
    try {
        const items = await Itinerary.find({ userId: req.user.id });
        res.json({ data: items });
    } catch (err) { next(err); }
};

export const saveItinerary = async (req, res, next) => {
    try {
        const doc = await Itinerary.create({
            ...req.body,
            userId: req.user.id,
        });
        res.status(201).json({ data: doc });
    } catch (err) { next(err); }
};

export const deleteItinerary = async (req, res, next) => {
    try {
        await Itinerary.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });
        res.json({ success: true });
    } catch (err) { next(err); }
};
