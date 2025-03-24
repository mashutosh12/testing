import express from "express";
import { reportIncident, getAllIncidents, getIncidentById, resolveIncident } from "../controllers/incidentController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/report", verifyToken, reportIncident); //Incident Report Karne Ka API
router.get("/", verifyToken, getAllIncidents); //Sabhi Incidents Fetch Karne Ka API
router.get("/:id", verifyToken, getIncidentById); //Single Incident Details Fetch Karna
router.put("/:id/resolve", verifyToken, resolveIncident); //Incident Ko "Resolved" Mark Karna

export default router;
