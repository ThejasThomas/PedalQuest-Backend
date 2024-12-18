const express=require('express')
const adminRoute=express.Router()
const {adminLogin}=require('../controller/adminController')

adminRoute.post('/login',adminLogin)


module.exports =adminRoute;


