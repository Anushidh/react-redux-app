import express from "express";
import { loginAdmin, blockUser, unblockUser, createUser } from "../controller/adminController.js";
import { AdminAuth } from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/adminlogin", loginAdmin);
router.post('/blockuser', AdminAuth, blockUser);
router.post('/unblockuser', AdminAuth, unblockUser);
router.post("/createuser", AdminAuth, upload.single("profilePicture"), createUser );

export default router;
