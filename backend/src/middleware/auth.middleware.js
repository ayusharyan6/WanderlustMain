import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log(token)
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");

    // get user from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user; 
    next();

  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      message: "Not authorized, token invalid",
      error: error.message,
    });
  }
};

export default protect;
