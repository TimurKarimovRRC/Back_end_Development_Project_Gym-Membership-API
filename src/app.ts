import express from "express";
import cors from "cors";
import { helmetMiddleware } from "./config/helmetOptions";
import { getCorsOptions } from "./config/corsOptions";
import { HTTP_STATUS } from "./constants/httpStatus";

const app = express();

app.use(express.json());
app.use(helmetMiddleware);
app.use(cors(getCorsOptions()));

app.get("/", (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    message: "Gym Membership API is running",
  });
});

app.get("/api/v1", (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    message: "Gym Membership API v1 is running",
  });
});

app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    message: "Route not found",
  });
});

export default app;