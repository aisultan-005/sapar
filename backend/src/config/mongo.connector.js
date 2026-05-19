import mongoose from "mongoose";
import { config } from "./env.js";

const mongooseOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10_000,
};

/**
 * Подключение к MongoDB для бэкенда сайта (Mongoose).
 * URI берётся из MONGO_URI или, если не задан, из локального fallback в env.js.
 */
export async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }
    try {
        const conn = await mongoose.connect(config.mongoUri, mongooseOptions);
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
}

export async function disconnectDB() {
    if (mongoose.connection.readyState === 0) return;
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
}
