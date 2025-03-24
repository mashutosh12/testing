import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import upload from "../middlewares/uploadMiddleware.js";
import { registerUser,sendOtp,verifyEmail,verifyOTP,updateProfile, uploadProfilePic, getAllUsers,getUserById,deleteUser,loginUser,verifyLoginOTP,logoutUser,resetPassword,forgotPassword ,addEmergencyContact, getEmergencyContacts,sendEmergencyAlert,sendDiscreetAlert} from "../controllers/userController.js"; 

const router = express.Router();

router.post("/register", registerUser);
router.get("/send-otp", sendOtp);
router.post("/verify-otp", verifyOTP); 
router.post("/upload-profile-pic", verifyToken, upload.single("profilePic"), uploadProfilePic); 
router.put("/update-profile", verifyToken, updateProfile);
router.get("/verify-email/:token", verifyEmail); 
router.post("/login", loginUser);
router.post("/verify-login-otp", verifyLoginOTP); 
router.post("/logout", logoutUser); 
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/add-emergency-contact", verifyToken, addEmergencyContact);
router.get("/emergency-contacts", verifyToken, getEmergencyContacts); 
router.post("/send-emergency-alert", verifyToken, sendEmergencyAlert);
router.post("/send-discreet-alert", verifyToken, sendDiscreetAlert);  
export default router;
