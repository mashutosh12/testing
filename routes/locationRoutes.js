import express from "express";
import { saveLocation, getUserLocation } from "../controllers/locationController.js";

const router = express.Router();

router.post("/save", saveLocation);
router.get("/:userId", getUserLocation);

export default router;
