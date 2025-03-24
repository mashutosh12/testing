import express from "express";
import { detectThreat } from "../controllers/threatController.js";
import { verifyToken } from "../middlewares/auth.js";


const router = express.Router();

//Threat Detection Route
router.post("/detect",verifyToken,  detectThreat);

export default router;
