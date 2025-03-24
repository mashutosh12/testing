import mongoose from "mongoose";

const PanicAlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const PanicAlert = mongoose.model("PanicAlert", PanicAlertSchema);

export default PanicAlert;
