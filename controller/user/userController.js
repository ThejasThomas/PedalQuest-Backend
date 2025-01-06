const express = require("express");
const User = require("../../model/userModel");
const Otp = require("../../model/otpModel"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { generateAccessToken, generateRefreshToken } = require("../../utils/jwt/generateToken");

const securePassword = async (password) => await bcrypt.hash(password, 10);

// Signup with OTP Generation
const signup = async (req, res) => {
  try {
    const { firstName, lastName, password, confirmPassword, email, phone } = req.body;

    if (!firstName || !lastName || !password || !confirmPassword || !email || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await securePassword(password);
    
    const user = await User.create({ firstName, lastName, email, phone, password: hashedPassword });

    const otp = crypto.randomInt(100000, 999999).toString();
    console.log("otp",otp);
    

    await Otp.create({ email, otp }); // Save OTP in MongoDB

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    return res.status(200).json({ success: true, message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// OTP Verification
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    await Otp.deleteMany({ email }); // Clean up OTPs
    return res.status(200).json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return res.status(500).json({ message: "Failed to verify OTP." });
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    await Otp.create({ email, otp });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    return res.status(200).json({ success: true, message: "OTP resent successfully." });
  } catch (error) {
    console.error("Error during OTP resending:", error);
    return res.status(500).json({ message: "Failed to resend OTP." });
  }
};

module.exports = { signup, verifyOtp, resendOtp };


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const userData = await User.findOne({ email: email });
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered, Please Signup",
      });
    }

    // Ensure user data exists before checking password
    const matchPass = await bcrypt.compare(password, userData.password);
    if (!matchPass) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if the account is active
    if (userData.isActive === false) {
      const message = "Your account is currently inactive, and access to the website is restricted.";
      return res.status(403).json({ success: false, message });
    }

    // Remove sensitive data like password
    userData.password = undefined;

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(userData._id);
    const refreshToken = generateRefreshToken(userData._id);

    // Set cookies for access and refresh tokens
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 minutes expiration for access token
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration for refresh token
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful, Welcome Back",
      userData,
    });

  } catch (err) {
    console.error("Unexpected error during login:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};


module.exports = { signup, verifyOtp, resendOtp ,login};
