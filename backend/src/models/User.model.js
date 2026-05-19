import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:       { type: String, required: true },
        email:      { type: String, required: true, unique: true },
        password:   { type: String, required: true, select: false },
        lang:       { type: String, default: "РУС", enum: ["ҚАЗ", "РУС", "ENG"] },
        isPremium:  { type: Boolean, default: false },
        likedIds:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Location" }],
        settings: {
            geoEnabled:        { type: Boolean, default: true  },
            analyticsEnabled:  { type: Boolean, default: false },
            darkMode:          { type: Boolean, default: false },
            notifications:     { type: Boolean, default: true  },
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
