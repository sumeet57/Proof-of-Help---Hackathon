import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import limiter from "./middlewares/rateLimiter.js";
import helmet from "helmet";
import hpp from "hpp";
import requestRouter from "./routes/request.route.js";
import donationRouter from "./routes/donation.route.js";

const app = express();

app.use(helmet());
app.use(hpp());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-session-id"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", limiter);
app.use("/api/user", userRouter);
app.use("/api/request", requestRouter);
app.use("/api/donation", donationRouter);

app.use("/", (req, res) => {
  res.json({ message: "Server is running" });
});
export default app;
