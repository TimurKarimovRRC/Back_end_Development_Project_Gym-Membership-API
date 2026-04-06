import { Router } from "express";
import { memberController } from "../controllers/member.controller";

const memberRoutes = Router();

memberRoutes.post("/", memberController.createMember);
memberRoutes.get("/", memberController.getAllMembers);
memberRoutes.get("/:memberId", memberController.getMemberById);
memberRoutes.put("/:memberId", memberController.updateMember);
memberRoutes.delete("/:memberId", memberController.deleteMember);

export default memberRoutes;