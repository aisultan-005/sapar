import "dotenv/config";

// CORS_ORIGINS — список доменов через запятую (например: https://sapar.vercel.app,http://localhost:3000)
const corsOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export const config = {
    port:        process.env.PORT        || 5000,
    mongoUri:    process.env.MONGO_URI   || "",          // пусто = Mongo отключена
    groqApiKey:  process.env.GROQ_API_KEY || "",
    groqModel:   process.env.GROQ_MODEL  || "openai/gpt-oss-20b",
    nodeEnv:     process.env.NODE_ENV    || "development",
    corsOrigins,
};
