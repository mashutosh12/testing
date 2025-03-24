import Location from "../models/Location.js";
import User from "../models/User.js";

//Save User's Location
export const saveLocation = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;

    if (!userId || !latitude || !longitude) {
      return res.status(400).json({ message: "Incomplete location data" });
    }

    const location = new Location({ userId, latitude, longitude });
    await location.save();

    res.status(200).json({ message: "Location saved successfully", location });
  } catch (error) {
    console.error("Error saving location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get User's Latest Location
export const getUserLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const location = await Location.findOne({ userId }).sort({ timestamp: -1 });

    if (!location) return res.status(404).json({ message: "No location found" });

    res.status(200).json(location);
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
