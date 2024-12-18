const jwt=require('jsonwebtoken')

const generateAccessToken = (data) => {
    try {
      return jwt.sign({ _id: data }, process.env.JWT_ADMIN_ACCESS_TOKEN_SECRET, {
        expiresIn: "13m",
      });
    } catch (err) {
      console.error("Error generating access token:", err);
      throw new Error("Failed to generate access token");
    }
  };
  
  const generateRefreshToken = (data) => {
    try {
      return jwt.sign({ id: data }, process.env.JWT_STUDENT_REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
      });
    } catch (err) {
      console.error("Error generating refresh token:", err);
      throw new Error("Failed to generate refresh token");
    }
  };
  

module.exports = { generateAccessToken, generateRefreshToken };
