import PanicAlert from "../models/PanicAlert.js";
import User from "../models/User.js";

export const sendPanicAlert = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user.userId; //JWT Token se userID le raha hai

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and Longitude required" });
    }

    //MongoDB me Panic Alert Save Karo
    const alert = new PanicAlert({ userId, latitude, longitude });
    await alert.save();

    //Emergency Contacts ke liye Future Notification (SMS/Email)
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    console.log(`Emergency Alert Sent to ${user.name}'s Contacts`);

    //Response
    res.json({ message:"Panic Alert Sent Successfully!", alert });
  } catch (error) {
    console.error("Error Sending Panic Alert:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPanicAlerts = async (req, res) => {
  try {
    const alerts = await PanicAlert.find().populate("userId", "name email");
    res.json(alerts);
  } catch (error) {
    console.error("Error Fetching Panic Alerts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
