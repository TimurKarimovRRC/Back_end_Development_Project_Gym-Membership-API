import express from "express";
import cors from "cors";
import memberRoutes from "./api/v1/routes/member.routes";
import subscriptionRoutes from "./api/v1/routes/subscription.routes";
import visitRoutes from "./api/v1/routes/visit.routes";
import healthRoutes from "./api/v1/routes/health.routes";
import adminRoutes from "./api/v1/routes/admin.routes";
import { errorHandler, notFoundHandler } from "./api/v1/middleware/errorHandler";
import { getCorsOptions } from "./config/corsOptions";
import { helmetMiddleware } from "./config/helmetOptions";
import setupSwagger from "./config/swagger";
import { HTTP_STATUS } from "./constants/httpStatus";

const app = express();

app.use(express.json());
app.use(helmetMiddleware);
app.use(cors(getCorsOptions()));

setupSwagger(app);

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

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/members", memberRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/visits", visitRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;