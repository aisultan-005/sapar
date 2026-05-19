import { Router } from "express";
import { generateAIRoute } from "../controllers/ai.controller.js";

const router = Router();

// POST /api/ai/route
// body: { preferences: { tags, budget, duration, accessibility } }
router.post("/route", generateAIRoute);

export default router;
