import SosAlert from "../models/sosAlert.js";

//Handle SOS Alert
export const triggerSosAlert = async (req, res) => {
  try {
    const { userId, location } = req.body;

    const newAlert = new SosAlert({ userId, location });
    await newAlert.save();

    res.status(201).json({ message: "SOS Alert Sent Successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
