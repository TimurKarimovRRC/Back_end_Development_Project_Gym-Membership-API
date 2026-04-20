import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const adminRoutes = Router();

adminRoutes.get(
  "/dashboard",
  authenticate,
  authorize("admin"),
  adminController.getAdminDashboard,
);

adminRoutes.get(
  "/inactive-members",
  authenticate,
  authorize("admin"),
  adminController.getInactiveMembers,
);

adminRoutes.post(
  "/inactive-members/:memberId/reminder",
  authenticate,
  authorize("admin"),
  adminController.sendInactiveMemberReminder,
);

export default adminRoutes;