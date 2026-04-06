import express from "express";
import cors from "cors";
import memberRoutes from "./api/v1/routes/member.routes";
import subscriptionRoutes from "./api/v1/routes/subscription.routes";
import { getCorsOptions } from "./config/corsOptions";
import { helmetMiddleware } from "./config/helmetOptions";
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

app.use("/api/v1/members", memberRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);

app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    message: "Route not found",
  });
});

export default app;