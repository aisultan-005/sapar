import mongoose from "mongoose";
import { config } from "./env.js";

const mongooseOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10_000,
};

/**
 * Подключение к MongoDB. Если MONGO_URI не задан или подключение упало,
 * сервер всё равно стартует — просто эндпоинты, требующие БД, вернут 503.
 */
export async function connectDB() {
    if (!config.mongoUri) {
        console.warn("⚠️  MONGO_URI не задан — Mongo отключена (AI-эндпоинты работают, /api/itinerary вернёт 503).");
        return null;
    }
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }
    try {
        const conn = await mongoose.connect(config.mongoUri, mongooseOptions);
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        console.warn("⚠️  Сервер продолжит работу без БД.");
        return null;
    }
}

export const isMongoConnected = () => mongoose.connection.readyState === 1;

export async function disconnectDB() {
    if (mongoose.connection.readyState === 0) return;
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
}
