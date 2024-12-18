const express = require("express");
const User = require("../model/userModel");
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
require("dotenv").config();

const securePassword = async (password) => {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      console.log(error);
    }
  };
  const adminLogin =async (req,res)=>{
    try{
        const {email,password} =req.body
        const adminInfo =await User.findOne({email})

        if(adminInfo?.isAdmin){
            if(await bcrypt.compare( password,adminInfo.password)){
                const token = jwt.sign({id:adminInfo._id},process.env.JWT_SECRET,{expiresIn:"30d"})

                res.cookie("token",token,{
                    httpOnly:true,
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    secure: false,
                    sameSite: 'lax',
                });

                return res.status(200).json({
                    message: "Login successful",
                    _id: adminInfo._id,
                    name: adminInfo.name,
                    password: adminInfo.password,
                    email :adminInfo.email,
                    phone :adminInfo.phone,
                    profileImage:adminInfo.profileImage
                  });
            }else{
                res.json("invalid password")
                console.log("admin password is wrong");   
            }
        }else{
            res.status(401).json({message:"No access"})
        }
    }catch(err){
       console.log(err);    
    }
}
module.exports ={
    adminLogin,
}