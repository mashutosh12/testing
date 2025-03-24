import Incident from "../models/Incident.js";

//Incident Report Karne Ka API
export const reportIncident = async (req, res) => {
  try {
    const { description, location } = req.body;
    const userId = req.user.userId;  // JWT Token Se User ID Get Karo

    if (!description || !location) {
      return res.status(400).json({ message: "Description and location are required" });
    }

    const newIncident = new Incident({
      user: userId,
      description,
      location,
    });

    await newIncident.save();
    res.status(201).json({ message: "Incident reported successfully!" });

  } catch (error) {
    console.error("Error Reporting Incident:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//All Reported Incidents Ko Fetch Karne Ka API (Admin Use Karega)
export const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().populate("user", "name email"); // User Ke Naam & Email Ke Saath Fetch Karo
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Single Incident Details Fetch Karne Ka API
export const getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id).populate("user", "name email");
    if (!incident) return res.status(404).json({ message: "Incident not found" });

    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Incident Ko "Resolved" Mark Karne Ka API (Sirf Admin Kar Sakega)
export const resolveIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: "Incident not found" });

    incident.status = "Resolved";
    await incident.save();

    res.json({ message: "Incident marked as resolved" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
