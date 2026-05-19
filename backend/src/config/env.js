import "dotenv/config";

export const config = {
    port:       process.env.PORT       || 5000,
    mongoUri:   process.env.MONGO_URI  || "mongodb://localhost:27017/sapar",
    groqApiKey: process.env.GROQ_API_KEY || "",
    groqModel:  process.env.GROQ_MODEL || "openai/gpt-oss-20b",
    nodeEnv:    process.env.NODE_ENV   || "development",
};
