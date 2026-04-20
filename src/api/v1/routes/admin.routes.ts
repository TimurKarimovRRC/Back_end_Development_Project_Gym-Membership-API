import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const adminRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only dashboard and reminder endpoints
 */

/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access granted
 *                 dashboard:
 *                   type: object
 *                   properties:
 *                     totalMembers:
 *                       type: number
 *                       example: 12
 *                     totalSubscriptions:
 *                       type: number
 *                       example: 8
 *                     totalVisits:
 *                       type: number
 *                       example: 37
 *                     activeMembersCount:
 *                       type: number
 *                       example: 9
 *                     inactiveMembersCount:
 *                       type: number
 *                       example: 2
 *                     suspendedMembersCount:
 *                       type: number
 *                       example: 1
 *       401:
 *         description: Authorization token is missing or invalid
 *       403:
 *         description: Forbidden
 */
adminRoutes.get(
  "/dashboard",
  authenticate,
  authorize("admin"),
  adminController.getAdminDashboard,
);

/**
 * @swagger
 * /api/v1/admin/inactive-members:
 *   get:
 *     summary: Get inactive members based on recent visit activity
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inactive members loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 thresholdDays:
 *                   type: number
 *                   example: 14
 *                 totalInactiveMembers:
 *                   type: number
 *                   example: 3
 *                 members:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       memberId:
 *                         type: string
 *                         example: member_123
 *                       firstName:
 *                         type: string
 *                         example: Timur
 *                       lastName:
 *                         type: string
 *                         example: Karimov
 *                       email:
 *                         type: string
 *                         example: tkarimov@academic.rrc.ca
 *                       membershipStatus:
 *                         type: string
 *                         example: active
 *                       lastVisitDate:
 *                         type: string
 *                         nullable: true
 *                         example: 2026-04-01T00:00:00.000Z
 *                       daysSinceLastVisit:
 *                         type: number
 *                         nullable: true
 *                         example: 19
 *       401:
 *         description: Authorization token is missing or invalid
 *       403:
 *         description: Forbidden
 */
adminRoutes.get(
  "/inactive-members",
  authenticate,
  authorize("admin"),
  adminController.getInactiveMembers,
);

/**
 * @swagger
 * /api/v1/admin/inactive-members/{memberId}/reminder:
 *   post:
 *     summary: Send reminder email to an inactive member
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Inactive reminder sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inactive reminder sent to tkarimov@academic.rrc.ca
 *                 member:
 *                   type: object
 *                   properties:
 *                     memberId:
 *                       type: string
 *                       example: member_123
 *                     firstName:
 *                       type: string
 *                       example: Timur
 *                     lastName:
 *                       type: string
 *                       example: Karimov
 *                     email:
 *                       type: string
 *                       example: tkarimov@academic.rrc.ca
 *                     membershipStatus:
 *                       type: string
 *                       example: active
 *                     lastVisitDate:
 *                       type: string
 *                       nullable: true
 *                       example: 2026-04-01T00:00:00.000Z
 *                     daysSinceLastVisit:
 *                       type: number
 *                       nullable: true
 *                       example: 19
 *       400:
 *         description: Email configuration is not available
 *       401:
 *         description: Authorization token is missing or invalid
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Inactive member not found
 */
adminRoutes.post(
  "/inactive-members/:memberId/reminder",
  authenticate,
  authorize("admin"),
  adminController.sendInactiveMemberReminder,
);

/**
 * @swagger
 * /api/v1/admin/expiring-subscriptions:
 *   get:
 *     summary: Get subscriptions that are expiring soon
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expiring subscriptions loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 thresholdDays:
 *                   type: number
 *                   example: 7
 *                 totalExpiringSubscriptions:
 *                   type: number
 *                   example: 2
 *                 subscriptions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       subscriptionId:
 *                         type: string
 *                         example: sub_123
 *                       memberId:
 *                         type: string
 *                         example: member_123
 *                       firstName:
 *                         type: string
 *                         example: Timur
 *                       lastName:
 *                         type: string
 *                         example: Karimov
 *                       email:
 *                         type: string
 *                         example: tkarimov@academic.rrc.ca
 *                       planName:
 *                         type: string
 *                         example: Monthly Premium
 *                       endDate:
 *                         type: string
 *                         example: 2026-04-21T00:00:00.000Z
 *                       daysUntilEnd:
 *                         type: number
 *                         example: 1
 *                       paymentStatus:
 *                         type: string
 *                         example: paid
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *       401:
 *         description: Authorization token is missing or invalid
 *       403:
 *         description: Forbidden
 */
adminRoutes.get(
  "/expiring-subscriptions",
  authenticate,
  authorize("admin"),
  adminController.getExpiringSubscriptions,
);

/**
 * @swagger
 * /api/v1/admin/expiring-subscriptions/{subscriptionId}/reminder:
 *   post:
 *     summary: Send reminder email for an expiring subscription
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subscriptionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription reminder sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription reminder sent to tkarimov@academic.rrc.ca
 *                 subscription:
 *                   type: object
 *                   properties:
 *                     subscriptionId:
 *                       type: string
 *                       example: sub_123
 *                     memberId:
 *                       type: string
 *                       example: member_123
 *                     firstName:
 *                       type: string
 *                       example: Timur
 *                     lastName:
 *                       type: string
 *                       example: Karimov
 *                     email:
 *                       type: string
 *                       example: tkarimov@academic.rrc.ca
 *                     planName:
 *                       type: string
 *                       example: Monthly Premium
 *                     endDate:
 *                       type: string
 *                       example: 2026-04-21T00:00:00.000Z
 *                     daysUntilEnd:
 *                       type: number
 *                       example: 1
 *                     paymentStatus:
 *                       type: string
 *                       example: paid
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Email configuration is not available
 *       401:
 *         description: Authorization token is missing or invalid
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Expiring subscription not found
 */
adminRoutes.post(
  "/expiring-subscriptions/:subscriptionId/reminder",
  authenticate,
  authorize("admin"),
  adminController.sendExpiringSubscriptionReminder,
);

export default adminRoutes;