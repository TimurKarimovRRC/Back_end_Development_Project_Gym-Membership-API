import { Router } from "express";
import { HTTP_STATUS } from "../../../constants/httpStatus";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const adminRoutes = Router();

adminRoutes.get(
  "/dashboard",
  authenticate,
  authorize("admin"),
  (req, res) => {
    res.status(HTTP_STATUS.OK).json({
      message: "Admin access granted",
      dashboard: {
        totalMembers: "demo-value",
        totalSubscriptions: "demo-value",
        totalVisits: "demo-value",
      },
    });
  },
);

export default adminRoutes;