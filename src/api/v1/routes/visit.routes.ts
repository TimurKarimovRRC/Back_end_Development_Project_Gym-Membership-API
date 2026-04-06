import { Router } from "express";
import { visitController } from "../controllers/visit.controller";

const visitRoutes = Router();

visitRoutes.post("/", visitController.createVisit);
visitRoutes.get("/", visitController.getAllVisits);
visitRoutes.get("/:visitId", visitController.getVisitById);
visitRoutes.put("/:visitId", visitController.updateVisit);
visitRoutes.delete("/:visitId", visitController.deleteVisit);

export default visitRoutes;