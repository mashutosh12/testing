import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import twilio from "twilio";
import jwt from "jsonwebtoken";



export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate Inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Password Hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP & Verification Token
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const otpExpires = Date.now() + 30 * 60 * 1000;

    // Save User to Database
    user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      verificationToken,
    });

    await user.save();

    // Send OTP + Verification Link via Email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const verificationURL = `http://localhost:3000/verify-email/${verificationToken}`;

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Verify Your Email",
      html: `<p>Your OTP: <b>${otp}</b></p>
             <p>Or Click on this link to verify: <a href="${verificationURL}">Verify Email</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User registered successfully. Check your email for OTP & verification link.",
    });

  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Your OTP Code",
      html: `<p>Your OTP is: <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent successfully!" }); // ✅ Yeh zaroori hai

  } catch (error) {
    console.error("Error in sendOtp:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "OTP verified successfully!" });

  } catch (error) {
    console.error("Error in verifyOTP:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Your Login OTP",
      html: `<p>Your OTP for login is: <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent to email. Please verify to complete login." });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Login successful", token });

  } catch (error) {
    console.error("Error in verifyLoginOTP:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
  
export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({}, "-password"); //  Password show nahi karega
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id, "-password");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export const deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  export const logoutUser = (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
  
      res.json({ message: "Logout successful" });
    });
  };
  export const resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
  
      //Check if token is valid
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() } // Token expire toh nahi hua?
      });
  
      if (!user) return res.status(400).json({ message: "Invalid or expired token" });
  
      //Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
  
      // Reset token fields null kar do
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
      res.json({ message: "Password reset successful. You can now log in!" });
  
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      //Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      //Generate Reset Token
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
      await user.save();
  
      //Email Setup
      const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        }
      });
  
      const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
  
      //Email Content
      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL,
        subject: "Password Reset Request",
        html: `<p>You requested a password reset. Click <a href="${resetURL}">here</a> to reset your password. The link will expire in 1 hour.</p>`
      };
  
      await transporter.sendMail(mailOptions);
      res.json({ message: "Reset password email sent. Check your inbox!" });
  
    } catch (error) {
      console.error("Forgot Password Error:", error);  // Error print hoga
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  export const verifyEmail = async (req, res) => {
    try {
      const { token } = req.params;
  
      //User Find Karo
      const user = await User.findOne({ verificationToken: token });
      if (!user) return res.status(400).json({ message: "Invalid verification link" });

      //User Verify Kar Do
      user.isVerified = true;
      user.verificationToken = undefined;  // Token Remove Karo
      await user.save();

      res.json({ message: "Email verified successfully! You can now login." });

    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
};

  export const updateProfile = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const userId = req.user.userId;  // JWT Se User ID Nikaalo
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      //Agar Name Ya Email Update Ho Raha Hai
      if (name) user.name = name;
      if (email) user.email = email;
  
      //Agar Password Change Ho Raha Hai
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
  
      await user.save();
      res.json({ message: "Profile updated successfully", user });
  
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export const uploadProfilePic = async (req, res) => {
    try {
      const userId = req.user.userId; // JWT Se User ID Nikaalo
      const user = await User.findById(userId);
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  
      // Save Profile Picture Path In Database
      user.profilePic = `/uploads/${req.file.filename}`;
      await user.save();
  
      res.json({ message: "Profile picture updated successfully", profilePic: user.profilePic });
  
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export const addEmergencyContact = async (req, res) => {
    try {
      const { name, relation, phone } = req.body;
      const userId = req.user.userId;  // JWT Token Se User ID Nikaalo
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Naya Emergency Contact Add Karo
      user.emergencyContacts.push({ name, relation, phone });
      await user.save();
  
      res.json({ message: "Emergency contact added successfully", emergencyContacts: user.emergencyContacts });
  
    } catch (error) {
      console.error("Error Adding Emergency Contact:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export const getEmergencyContacts = async (req, res) => {
    try {
        console.log("Request Received for Emergency Contacts");

        // Step 1: JWT Token Se User ID Nikaalo
        const userId = req.user?.userId;  
        console.log("Extracted User ID:", userId);

        //Step 2: Check Karo Ki User ID Exist Karti Hai Ya Nahi
        if (!userId) {
            console.log("No User ID Found in Request!");
            return res.status(401).json({ message: "Unauthorized! Invalid Token." });
        }

        //Step 3: Database Se User Fetch Karo
        const user = await User.findById(userId, "emergencyContacts");
        if (!user) {
            console.log("User Not Found in Database!");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Emergency Contacts Found:", user.emergencyContacts);
        res.json({ emergencyContacts: user.emergencyContacts });

    } catch (error) {
        console.error("Error Fetching Emergency Contacts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendEmergencyAlert = async (req, res) => {
  try {
    const userId = req.user.userId;  //JWT Se User ID Nikaalo
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.emergencyContacts || user.emergencyContacts.length === 0) {
      return res.status(400).json({ message: "No emergency contacts found" });
    }

    // Emergency Message
    const messageBody = ` EMERGENCY ALERT \n${user.name} is in trouble! Please check their location & contact them immediately.`;

    // Har Emergency Contact Ko SMS Send Karo
    for (const contact of user.emergencyContacts) {
      await client.messages.create({
        body: messageBody,
        from: process.env.TWILIO_PHONE_NUMBER,  // Twilio Virtual Number
        to: contact.phone  // Emergency Contact Ka Number
      });
    }

    res.json({ message: "Emergency alerts sent successfully!" });

  } catch (error) {
    console.error("Error Sending Emergency Alert:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const sendDiscreetAlert = async (req, res) => {
  try {
    const userId = req.user.userId;  
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    //Emergency Message
    const messageBody = ` DISCREET ALERT \n${user.name} is in trouble! Please check their location.`;

    //Emergency Contact Ko Message Bhejo
    for (const contact of user.emergencyContacts) {
      await client.messages.create({
        body: messageBody,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: contact.phone
      });
    }

    res.json({ message: "Discreet emergency alert sent!" });

  } catch (error) {
    console.error("Error Sending Alert:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

  
