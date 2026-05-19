import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    time:     { type: String, required: true },
    title:    { type: String, required: true },
    subtitle: { type: String },
    duration: { type: String },
    icon:     { type: String, default: "added" },
    locId:    { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
});

const itinerarySchema = new mongoose.Schema(
    {
        userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        title:    { type: String, required: true },
        region:   { type: String },
        days:     { type: Number, default: 1 },
        items:    [itemSchema],
        budget:   { type: Number },
        distance: { type: Number },
        isAI:     { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model("Itinerary", itinerarySchema);
