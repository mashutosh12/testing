import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  description: { type: String, required: true }, 
  location: { type: String, required: true }, 
  status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" }, 
  reportedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Incident", incidentSchema);
