import express from "express";
import { triggerSosAlert } from "../controllers/sosController.js";

const router = express.Router();

//SOS Alert Route
router.post("/trigger", triggerSosAlert);

export default router;
