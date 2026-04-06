import { Router } from "express";
import { HTTP_STATUS } from "../../../constants/httpStatus";

const healthRoutes = Router();

healthRoutes.get("/", (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

export default healthRoutes;