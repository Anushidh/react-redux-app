import asyncHandler from "express-async-handler";
import { errorHandler } from "../utils/error.js";
import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const Signup = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);

    if (!name || !email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(errorHandler(400, "User already exists"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUrl =
      "https://i.pinimg.com/564x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg";

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePic: imageUrl,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
});

export const Signin = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(401, "User not found"));
    }
    if (validUser.isBlocked) {
      return next(errorHandler(403, "User is blocked"));
    }
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials"));
    }

    const { password: hashedPassword, ...userDetails } = validUser._doc;

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const expiryDate = new Date(Date.now() + 3600000);
    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json({
        name: userDetails.name,
        email: userDetails.email,
        profilePic: userDetails.profilePic,
        token,
      });
  } catch (error) {
    next(error);
  }
});

export const updateUser = asyncHandler(async (req, res, next) => {
  console.log("Request Body:", req.body);
  console.log("Uploaded File:", req.file);

  try {
    const { name, email } = req.body;
    const image = req.file; 

    const isValidImage = (filename) => {
      const validExtensions = [".jpeg", ".jpg", ".png"];
      const ext = filename.split(".").pop().toLowerCase();
      return validExtensions.includes(`.${ext}`);
    };

    if (image) {
      if (!isValidImage(image.originalname)) {
        return next(
          errorHandler(
            400,
            "Invalid file type. Only JPEG and PNG files are allowed."
          )
        );
      }

      const updated = await User.findOneAndUpdate(
        { _id: req.user._id }, 
        {
          $set: {
            name: name,
            email: email,
            profilePic: "http://localhost:3000/server/assets/" + image.filename, 
          },
        },
        { new: true }
      );
      if (updated) {
        res.json({
          name,
          email,
          profilePic: updated.profilePic, 
        });
      }
    } else {
      const updated = await User.findOneAndUpdate(
        { _id: req.user._id }, 
        {
          $set: {
            name: name,
            email: email,
          },
        },
        { new: true }
      );
      if (updated) {
        res.json({
          name,
          email,
          profilePic: updated.profilePic, 
        });
      }
    }
  } catch (error) {
    next(error);
  }
});
