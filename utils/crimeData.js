import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const CRIME_API_KEY = process.env.CRIMEOMETER_API_KEY;

export const fetchCrimeData = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://api.crimeometer.com/v1/incidents/raw-data?lat=${lat}&lon=${lng}&distance=2mi`,
      {
        headers: { "x-api-key": CRIME_API_KEY },
      }
    );
    return response.data.incidents || [];
  } catch (error) {
    console.error("Error fetching crime data:", error);
    return [];
  }
};
