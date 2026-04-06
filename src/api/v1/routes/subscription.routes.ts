import { Router } from "express";
import { subscriptionController } from "../controllers/subscription.controller";

const subscriptionRoutes = Router();

subscriptionRoutes.post("/", subscriptionController.createSubscription);
subscriptionRoutes.get("/", subscriptionController.getAllSubscriptions);
subscriptionRoutes.get(
  "/:subscriptionId",
  subscriptionController.getSubscriptionById,
);
subscriptionRoutes.put(
  "/:subscriptionId",
  subscriptionController.updateSubscription,
);
subscriptionRoutes.delete(
  "/:subscriptionId",
  subscriptionController.deleteSubscription,
);

export default subscriptionRoutes;