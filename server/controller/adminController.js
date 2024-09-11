import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import asyncHandler from "express-async-handler";
import { errorHandler } from "../utils/error.js";

export const loginAdmin = asyncHandler(async (req, res, next) => {
  try {
    console.log("inside loginadmin");
    const { email, password } = req.body;
    console.log(req.body);

    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(401, "Admin not found"));
    }
    console.log(validUser);

    if (!validUser.isAdmin) {
      return next(errorHandler(403, "Access denied. Admins only."));
    }

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials"));
    }

    const { password: hashedPassword, ...userDetails } = validUser._doc;

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(token);
    console.log(validUser._id);
    const userData = await User.find({ _id: { $ne: validUser._id } });
    console.log(userData);

    const expiryDate = new Date(Date.now() + 3600000); // 1 hour from now
    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json({
        name: userDetails.name,
        email: userDetails.email,
        profilePic: userDetails.profilePic,
        token,
        userData,
      });
  } catch (error) {
    next(error);
  }
});

export const blockUser = asyncHandler(async (req, res, next) => {
  try {
    console.log("inside block user");
    const userEmail = req.body.email;
    console.log(userEmail);

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { isBlocked: true },
      { new: true }
    );

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const userData = await User.find({ isAdmin: false });
    console.log(userData);

    res.status(200).json({
      userData,
      token: req.token,
    });
  } catch (error) {
    next(error);
  }
});

export const unblockUser = asyncHandler(async (req, res, next) => {
  try {
    console.log("inside unblock user");
    const userEmail = req.body.email;
    console.log(userEmail);

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { isBlocked: false },
      { new: true }
    );

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const userData = await User.find({ isAdmin: false });
    console.log(userData);

    res.status(200).json({
      userData,
      token: req.token,
    });
  } catch (error) {
    next(error);
  }
});

export const createUser = async (req, res, next) => {
  try {
    
    const { name, email, password } = req.body;
    const profilePicture = req.file ? req.file.path : null; 

   
    if (!name || !email || !password) {
      return next(errorHandler(400, "Name, email, and password are required"));
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "User already exists"));
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePic: "http://localhost:3000/server/assets/" + profilePicture, 
    });

  
    await newUser.save();
    const userData = await User.find({ isAdmin: { $ne: true } });
    res.status(201).json({
      message: "User created successfully",
      userData,
    });
  } catch (error) {
    next(error);
  }
};
