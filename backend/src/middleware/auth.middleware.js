import { getAuth } from "@clerk/express";

export const protect = (req, res, next) => {
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ error: "Нет токена авторизации" });
    }
    req.user = { id: userId };
    next();
};
