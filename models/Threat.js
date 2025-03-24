import mongoose from "mongoose";

const ThreatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  riskLevel: { type: String, enum: ["Low", "Medium", "High"], required: true },
  totalCrimes: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Threat", ThreatSchema);
