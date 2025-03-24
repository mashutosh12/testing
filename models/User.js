import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // OTP & Verification
  otp: { type: String },
  otpExpires: { type: Date },
  verificationToken: { type: String },
  isVerified: { type: Boolean, default: false }, 

  // Reset Password
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  // Profile & Security
  profilePic: { type: String, default: "" },
  discreetCode: { type: String, default: "HELP123" }, 

  // Emergency Contacts
  emergencyContacts: [
    {
      name: { type: String, required: true },
      relation: { type: String, required: true },  // Example: Father, Mother, Brother, etc.
      phone: { type: String, required: true }
    }
  ],
  
}, { timestamps: true });

export default mongoose.model("User", userSchema);
