import express from "express";
import { sendPanicAlert, getPanicAlerts } from "../controllers/panicController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//POST: Send Panic Alert
router.post("/send-alert", verifyToken, sendPanicAlert);

//GET: Fetch Panic Alerts
router.get("/alerts", verifyToken, getPanicAlerts);

export default router;
