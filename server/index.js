import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import cors from "cors";
import { fileURLToPath } from 'url';


dotenv.config();

const app = express();
connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/server/assets',express.static(path.join(__dirname,'./assets')))
app.use("/", userRoute);
app.use("/admin", adminRoute);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
