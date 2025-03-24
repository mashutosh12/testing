import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

//Fetch Safe Route
router.post("/safe-route", async (req, res) => {
  try {
    const { origin, destination } = req.body;

    //Google Directions API Call
    const directionsResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json`,
      {
        params: {
          origin,
          destination,
          key: GOOGLE_MAPS_API_KEY,
          alternatives: true,
        },
      }
    );

    const routes = directionsResponse.data.routes;

    //Dummy Crime Data (Replace this with real API)
    const crimeData = [
      { lat: 28.7041, lng: 77.1025, risk: 8 }, // Delhi
      { lat: 19.0760, lng: 72.8777, risk: 5 }, // Mumbai
      { lat: 13.0827, lng: 80.2707, risk: 6 }, // Chennai
    ];

    //Check Which Route is Safest
    let safestRoute = null;
    let lowestRisk = Infinity;

    routes.forEach((route) => {
      let routeRisk = 0;

      route.legs[0].steps.forEach((step) => {
        const { lat, lng } = step.end_location;

        //Crime Data Compare
        crimeData.forEach((crime) => {
          const distance = Math.sqrt(
            Math.pow(lat - crime.lat, 2) + Math.pow(lng - crime.lng, 2)
          );

          if (distance < 0.05) {
            routeRisk += crime.risk;
          }
        });
      });

      if (routeRisk < lowestRisk) {
        lowestRisk = routeRisk;
        safestRoute = route;
      }
    });

    res.json({ safestRoute, message: "Safe Route Found!" });
  } catch (error) {
    console.error("Error Finding Safe Route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
