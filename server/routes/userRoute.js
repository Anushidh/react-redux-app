import express from "express";
import { Signup, Signin, updateUser } from "../controller/userController.js";
import upload from "../utils/multer.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", Signup);
router.post("/signin", Signin);
router.put("/updateUser", protect, upload.single("profilePicture"), updateUser);

export default router;
