import { getAuth } from "@clerk/express";

export const protect = (req, res, next) => {
    // Без CLERK_SECRET_KEY мидлварь Clerk не подключена и getAuth() бросает исключение
    if (!process.env.CLERK_SECRET_KEY) {
        return res.status(503).json({ error: "Auth not configured. Set CLERK_SECRET_KEY on the server." });
    }
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ error: "Нет токена авторизации" });
    }
    req.user = { id: userId };
    next();
};
