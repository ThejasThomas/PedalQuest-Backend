const express = require("express");
const User = require("../../model/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const securePassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        console.log(error);
        throw new Error('Password hashing failed');
    }
};

const adminLogin = async (req, res) => {
    try {
        // Check if admin JWT secret exists
        if (!process.env.JWT_ADMIN_ACCESS_TOKEN_SECRET) {
            throw new Error('JWT admin secret is not configured');
        }

        const { email, password } = req.body;
        const adminInfo = await User.findOne({ email });

        if (!adminInfo) {
            return res.status(401).json({ message: "User not found" });
        }

        if (adminInfo?.isAdmin) {
            const isPasswordValid = await bcrypt.compare(password, adminInfo.password);
            
            if (isPasswordValid) {
                const token = jwt.sign(
                    { id: adminInfo._id },
                    process.env.JWT_ADMIN_ACCESS_TOKEN_SECRET,  // Using the admin-specific JWT secret
                    { expiresIn: "30d" }
                );

                res.cookie("token", token, {
                    httpOnly: true,
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    secure: false,
                    sameSite: 'lax',
                });

                return res.status(200).json({
                    message: "Login successful",
                    _id: adminInfo._id,
                    name: adminInfo.name,
                    email: adminInfo.email,
                    phone: adminInfo.phone,
                    profileImage: adminInfo.profileImage
                });
            } else {
                return res.status(401).json({ message: "Invalid password" });
            }
        } else {
            return res.status(401).json({ message: "No admin access" });
        }
    } catch (err) {
        console.error('Admin login error:', err);
        return res.status(500).json({ 
            message: "Server error", 
            error: err.message 
        });
    }
};

module.exports = {
    adminLogin,
};