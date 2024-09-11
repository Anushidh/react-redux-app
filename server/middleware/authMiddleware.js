import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import userSchema from "../model/userModel.js";


export const protect = asyncHandler(async (req, res, next) => {
  console.log("Inside protect middleware");
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token:", token);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userSchema.findById(decoded.id).select("-password");
      console.log("User:", req.user);
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      console.log("Token verified, proceeding...");
      next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log("No token, authorization denied");
    res.status(401).json({ message: "No token, authorization denied" });
  }
});


export const AdminAuth = asyncHandler(async (req, res, next) => {
  console.log("Inside AdminAuth middleware");
  let token;

 
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token:", token);

    try {
     
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await userSchema.findById(decoded.id).select("-password"); 
      console.log("Admin:", req.admin);

      if (!req.admin || !req.admin.isAdmin) {
        return res.status(401).json({ message: "Admin not found or not authorized" });
      }

      
      req.token = token;
      console.log("Token verified, proceeding...");
      next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log("No token, authorization denied");
    res.status(401).json({ message: "No token, authorization denied" });
  }
});
