import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
    {
        day:      { type: Number, default: 1, min: 1 },
        time:     { type: String, required: true },
        title:    { type: String, required: true },
        subtitle: { type: String },
        duration: { type: String },
        icon:     { type: String, default: "added" },
        // id места из каталога (числовой, как на фронтенде)
        locId:    { type: Number },
        // [lat, lon]
        coords:   {
            type: [Number],
            validate: { validator: (v) => v.length === 0 || v.length === 2, message: "coords must be [lat, lon]" },
            default: undefined,
        },
    },
    { _id: false }
);

const itinerarySchema = new mongoose.Schema(
    {
        // Clerk userId вида "user_2abc..." — строка, не ObjectId
        userId:   { type: String, required: true, index: true },
        title:    { type: String, required: true, maxlength: 200 },
        region:   { type: String },
        days:     { type: Number, default: 1 },
        items:    { type: [itemSchema], validate: (v) => v.length <= 100 },
        budget:   { type: Number },
        distance: { type: Number },
        isAI:     { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model("Itinerary", itinerarySchema);
