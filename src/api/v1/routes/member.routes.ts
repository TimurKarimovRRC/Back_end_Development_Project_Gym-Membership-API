import { Router } from "express";
import { memberController } from "../controllers/member.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const memberRoutes = Router();

memberRoutes.get(
  "/",
  authenticate,
  authorize("admin"),
  memberController.getAllMembers,
);

memberRoutes.post(
  "/",
  authenticate,
  authorize("admin"),
  memberController.createMember,
);

memberRoutes.get(
  "/:memberId",
  authenticate,
  authorize("admin"),
  memberController.getMemberById,
);

memberRoutes.put(
  "/:memberId",
  authenticate,
  authorize("admin"),
  memberController.updateMember,
);

memberRoutes.delete(
  "/:memberId",
  authenticate,
  authorize("admin"),
  memberController.deleteMember,
);

export default memberRoutes;