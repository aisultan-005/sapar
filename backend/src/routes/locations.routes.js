import { Router } from "express";
import {
    getLocations,
    getLocationById,
    getNearbyLocations,
} from "../controllers/locations.controller.js";

const router = Router();

router.get("/",          getLocations);
router.get("/nearby",    getNearbyLocations);
router.get("/:id",       getLocationById);

export default router;
