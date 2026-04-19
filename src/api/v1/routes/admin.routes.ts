import { Router } from "express";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import { adminController } from "../controllers/admin.controller";

const adminRoutes = Router();

adminRoutes.get(
  "/dashboard",
  authenticate,
  authorize("admin"),
  adminController.getAdminDashboard,
);

export default adminRoutes;