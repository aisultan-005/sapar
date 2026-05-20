import "dotenv/config";
import express       from "express";
import cors          from "cors";
import helmet        from "helmet";
import { clerkMiddleware }  from "@clerk/express";
import { connectDB, isMongoConnected } from "./config/mongo.connector.js";
import { config }           from "./config/env.js";
import { errorHandler }     from "./middleware/errorHandler.js";
import locationsRoutes  from "./routes/locations.routes.js";
import itineraryRoutes  from "./routes/itinerary.routes.js";
import aiRoutes         from "./routes/ai.routes.js";

const app = express();

app.use(helmet());

// === CORS ===
// Если в списке есть "*" — открываем для всех (удобно для отладки).
// Иначе сверяем Origin запроса с белым списком из CORS_ORIGINS.
const allowAll = config.corsOrigins.includes("*");
app.use(
    cors({
        origin: (origin, callback) => {
            if (allowAll || !origin) return callback(null, true);
            if (config.corsOrigins.includes(origin)) return callback(null, true);
            return callback(new Error(`CORS: origin ${origin} not allowed`));
        },
    })
);

app.use(express.json());

// Clerk подключаем только если ключ задан (иначе он падает при старте).
if (process.env.CLERK_SECRET_KEY) {
    app.use(clerkMiddleware());
} else {
    console.warn("⚠️  CLERK_SECRET_KEY не задан — Clerk-мидлварь не подключена.");
}

// === Healthcheck (корень + /health) ===
const healthPayload = () => ({
    status: "ok",
    name: "sapar-backend",
    uptime: Math.round(process.uptime()),
    mongo: isMongoConnected() ? "connected" : "disconnected",
    groq:  config.groqApiKey ? "configured" : "missing",
    env:   config.nodeEnv,
    time:  new Date().toISOString(),
});
app.get("/",       (_req, res) => res.json(healthPayload()));
app.get("/health", (_req, res) => res.json(healthPayload()));

// === Роуты ===
app.use("/api/locations", locationsRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/ai",        aiRoutes);

// 404
app.use((req, res) => {
    res.status(404).json({ error: `Not found: ${req.method} ${req.path}` });
});

// Глобальный обработчик ошибок (без exit)
app.use(errorHandler);

// Поднимаем БД (не блокируя старт)
connectDB().catch((err) => console.error("Mongo init failed:", err.message));

const server = app.listen(config.port, () =>
    console.log(`🚀 Server running on port ${config.port}`)
);

server.on("error", (err) => {
    console.error("Server error:", err.message);
});

export default app;
