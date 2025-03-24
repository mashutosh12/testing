import mongoose from "mongoose";

const sosAlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("SosAlert", sosAlertSchema);
