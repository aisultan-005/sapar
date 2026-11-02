import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    saveItinerary,
    getUserItineraries,
    getItineraryById,
    deleteItinerary,
} from "../controllers/itinerary.controller.js";

const router = Router();

router.use(protect); // все маршруты защищены

router.get("/",       getUserItineraries);
router.get("/:id",    getItineraryById);
router.post("/",      saveItinerary);
router.delete("/:id", deleteItinerary);

export default router;
