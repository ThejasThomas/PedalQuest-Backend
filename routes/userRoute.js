const express = require("express");
const userRoute = express.Router();
const {fetchProductsForUser} =require('../controller/user/productHomeController')
const {
  signup,
  verifyOtp,
  resendOtp,
  login
} = require("../controller/user/userController");
const { fetchproducts } = require("../controller/admin/productController");

userRoute.post("/signup", signup);
userRoute.post("/verifyOtp", verifyOtp);
userRoute.post("/resendOtp", resendOtp);
userRoute.post('/login',login)
userRoute.get('/products',fetchProductsForUser)
module.exports = userRoute;

