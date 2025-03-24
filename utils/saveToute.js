import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const ORS_API_KEY = process.env.ORS_API_KEY;

export const getSafeRoute = async (start, end) => {
  try {
    const response = await axios.get(
      `https://api.openrouteservice.org/v2/directions/driving-car`,
      {
        params: {
          api_key: ORS_API_KEY,
          start: `${start.lon},${start.lat}`,
          end: `${end.lon},${end.lat}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching safe route:", error);
    return null;
  }
};
