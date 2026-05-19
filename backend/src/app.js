import "dotenv/config";
import express       from "express";
import cors          from "cors";
import helmet        from "helmet";
import { clerkMiddleware }  from "@clerk/express";
import { connectDB }        from "./config/mongo.connector.js";
import { config }           from "./config/env.js";
import { errorHandler }     from "./middleware/errorHandler.js";
import locationsRoutes  from "./routes/locations.routes.js";
import itineraryRoutes  from "./routes/itinerary.routes.js";
import aiRoutes         from "./routes/ai.routes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(clerkMiddleware());

// Роуты
app.use("/api/locations",  locationsRoutes);
app.use("/api/itinerary",  itineraryRoutes);
app.use("/api/ai",         aiRoutes);

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

app.use(errorHandler);

await connectDB();

const server = app.listen(config.port, () =>
    console.log(`🚀 Server running on port ${config.port}`)
);

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(
            `\n❌ Порт ${config.port} уже занят (EADDRINUSE).\n\n` +
                "Варианты:\n" +
                "  1) Найти и завершить процесс (PowerShell):\n" +
                `     Get-NetTCPConnection -LocalPort ${config.port} -ErrorAction SilentlyContinue | Select-Object OwningProcess\n` +
                "     Stop-Process -Id <PID> -Force\n" +
                "     или: netstat -ano | findstr :" +
                config.port +
                "\n" +
                "     затем: taskkill /PID <PID> /F\n\n" +
                "  2) Другой порт: в backend/.env задать PORT=5001\n" +
                "     и во frontend/.env — SAPAR_BACKEND_PORT=5001 (для Vite proxy).\n"
        );
        process.exit(1);
    }
    throw err;
});

export default app;
