import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    saveItinerary,
    getUserItineraries,
    deleteItinerary,
} from "../controllers/itinerary.controller.js";

const router = Router();

router.use(protect); // все маршруты защищены

router.get("/",    getUserItineraries);
router.post("/",   saveItinerary);
router.delete("/:id", deleteItinerary);

export default router;
