import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
    {
        name:     { type: String, required: true },
        subtitle: { type: String, required: true },
        rating:   { type: Number, default: 0, min: 0, max: 5 },
        reviews:  { type: Number, default: 0 },
        img:      { type: String, default: "almaty" },
        tags:     [{ type: String }],
        color:    { type: String, default: "#3B82F6" },
        coords: {
            lat: { type: Number },
            lon: { type: Number },
        },
        hours:    { type: String, default: "09:00 – 18:00" },
        isOpen:   { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model("Location", locationSchema);
