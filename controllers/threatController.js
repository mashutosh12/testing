import axios from "axios";
import dotenv from "dotenv";
import Threat from "../models/Threat.js";
import { fetchCrimeData } from "../utils/crimeData.js";

dotenv.config();
const ORS_API_KEY = process.env.ORS_API_KEY;

//AI-Powered Threat Detection API
export const detectThreat = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user.userId; // Extracted from JWT

    //Fetch Crime Data for Given Location
    const crimeData = await fetchCrimeData(latitude, longitude);
    const crimeCount = crimeData.length;

    //Risk Level Calculation (Smart AI Logic)
    let riskLevel = "Low";
    if (crimeCount > 10) riskLevel = "High";
    else if (crimeCount > 5) riskLevel = "Medium";

    //Get Safer Alternative Route
    const safeRouteResponse = await axios.get(
      `https://api.openrouteservice.org/v2/directions/driving-car`,
      {
        params: {
          api_key: ORS_API_KEY,
          start: `${longitude},${latitude}`,
          end: `${longitude + 0.02},${latitude + 0.02}`, // Dummy safe point
        },
      }
    );

    //Save Threat Alert to Database
    const threat = new Threat({ userId, latitude, longitude, riskLevel, totalCrimes: crimeCount });
    await threat.save();

    res.json({
      message: "Threat analyzed successfully!",
      riskLevel,
      totalCrimes: crimeCount,
      safeRoute: safeRouteResponse.data,
    });
  } catch (error) {
    console.error("Error in Threat Detection:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
