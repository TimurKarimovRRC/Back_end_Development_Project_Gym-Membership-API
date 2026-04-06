import { Router } from "express";
import { subscriptionController } from "../controllers/subscription.controller";

const subscriptionRoutes = Router();

/**
 * @swagger
 * /api/v1/subscriptions:
 *   post:
 *     summary: Create a new subscription
 *     tags:
 *       - Subscriptions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSubscriptionInput'
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *   get:
 *     summary: Get all subscriptions
 *     tags:
 *       - Subscriptions
 *     responses:
 *       200:
 *         description: A list of subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 */
subscriptionRoutes.post("/", subscriptionController.createSubscription);
subscriptionRoutes.get("/", subscriptionController.getAllSubscriptions);

/**
 * @swagger
 * /api/v1/subscriptions/{subscriptionId}:
 *   get:
 *     summary: Get a subscription by id
 *     tags:
 *       - Subscriptions
 *     parameters:
 *       - in: path
 *         name: subscriptionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found
 *   put:
 *     summary: Update a subscription by id
 *     tags:
 *       - Subscriptions
 *     parameters:
 *       - in: path
 *         name: subscriptionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSubscriptionInput'
 *     responses:
 *       200:
 *         description: Subscription updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found
 *   delete:
 *     summary: Delete a subscription by id
 *     tags:
 *       - Subscriptions
 *     parameters:
 *       - in: path
 *         name: subscriptionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription deleted successfully
 *       404:
 *         description: Subscription not found
 */
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