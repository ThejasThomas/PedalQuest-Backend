const express = require("express");
const userRoute = express.Router();
const {
  signup,
  verifyOtp,
  resendOtp,
  login
} = require("../controller/userController");

userRoute.post("/signup", signup);
userRoute.post("/verifyOtp", verifyOtp);
userRoute.post("/resendOtp", resendOtp);
userRoute.post('/login',login)

module.exports = userRoute;
