import { Router } from "express";
import { memberController } from "../controllers/member.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const memberRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Members
 *   description: Member management endpoints
 */

/**
 * @swagger
 * /api/v1/members:
 *   get:
 *     summary: Get all members
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Members loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: member_123
 *                   firstName:
 *                     type: string
 *                     example: Timur
 *                   lastName:
 *                     type: string
 *                     example: Karimov
 *                   email:
 *                     type: string
 *                     example: tkarimov@academic.rrc.ca
 *                   phoneNumber:
 *                     type: string
 *                     example: "2045551234"
 *                   dateOfBirth:
 *                     type: string
 *                     example: 1999-04-16T00:00:00.000Z
 *                   emergencyContactName:
 *                     type: string
 *                     example: John Karimov
 *                   emergencyContactPhoneNumber:
 *                     type: string
 *                     example: "2045559999"
 *                   membershipStatus:
 *                     type: string
 *                     example: active
 *                   joinDate:
 *                     type: string
 *                     example: 2026-04-20T00:00:00.000Z
 *                   createdAt:
 *                     type: string
 *                     example: 2026-04-20T03:00:00.000Z
 *                   updatedAt:
 *                     type: string
 *                     example: 2026-04-20T03:00:00.000Z
 *       401:
 *         description: Authorization token is missing or invalid
 *       403:
 *         description: Forbidden
 */
memberRoutes.get(
  "/",
  authenticate,
  authorize("admin"),
  memberController.getAllMembers,
);

/**
 * @swagger
 * /api/v1/members:
 *   post:
 *     summary: Create a new member
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phoneNumber
 *               - dateOfBirth
 *               - emergencyContactName
 *               - emergencyContactPhoneNumber
 *               - membershipStatus
 *               - joinDate
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Timur
 *               lastName:
 *                 type: string
 *                 example: Karimov
 *               email:
 *                 type: string
 *                 example: tkarimov@academic.rrc.ca
 *               phoneNumber:
 *                 type: string
 *                 example: "2045551234"
 *               dateOfBirth:
 *                 type: string
 *                 example: 1999-04-16T00:00:00.000Z
 *               emergencyContactName:
 *                 type: string
 *                 example: John Karimov
 *               emergencyContactPhoneNumber:
 *                 type: string
 *                 example: "2045559999"
 *               membershipStatus:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *                 example: active
 *               joinDate:
 *                 type: string
 *                 example: 2026-04-20T00:00:00.000Z
 *     responses:
 *       201:
 *         description: Member created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: member_123
 *                 firstName:
 *                   type: string
 *                   example: Timur
 *                 lastName:
 *                   type: string
 *                   example: Karimov
 *                 email:
 *                   type: string
 *                   example: tkarimov@academic.rrc.ca
 *                 phoneNumber:
 *                   type: string
 *                   example: "2045551234"
 *                 dateOfBirth:
 *                   type: string
 *                   example: 1999-04-16T00:00:00.000Z
 *                 emergencyContactName:
 *                   type: string
 *                   example: John Karimov
 *                 emergencyContactPhoneNumber:
 *                   type: string
 *                   example: "2045559999"
 *                 membershipStatus:
 *                   type: string
 *                   example: active
 *                 joinDate:
 *                   type: string
 *                   example: 2026-04-20T00:00:00.000Z
 *                 createdAt:
 *                   type: string
 *                   example: 2026-04-20T03:00:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   example: 2026-04-20T03:00:00.000Z
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authorization token is missing or invalid
 *       403:
 *         description: Forbidden
 */
memberRoutes.post(
  "/",
  authenticate,
  authorize("admin"),
  memberController.createMember,
);

/**
 * @swagger
 * /api/v1/members/{memberId}:
 *   get:
 *     summary: Get member by ID
 *     tags: [Members]
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
 *         description: Member loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: member_123
 *                 firstName:
 *                   type: string
 *                   example: Timur
 *                 lastName:
 *                   type: string
 *                   example: Karimov
 *                 email:
 *                   type: string
 *                   example: tkarimov@academic.rrc.ca
 *                 phoneNumber:
 *                   type: string
 *                   example: "2045551234"
 *                 dateOfBirth:
 *                   type: string
 *                   example: 1999-04-16T00:00:00.000Z
 *                 emergencyContactName:
 *                   type: string
 *                   example: John Karimov
 *                 emergencyContactPhoneNumber:
 *                   type: string
 *                   example: "2045559999"
 *                 membershipStatus:
 *                   type: string
 *                   example: active
 *                 joinDate:
 *                   type: string
 *                   example: 2026-04-20T00:00:00.000Z
 *                 createdAt:
 *                   type: string
 *                   example: 2026-04-20T03:00:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   example: 2026-04-20T03:00:00.000Z
 *       401:
 *         description: Authorization token is missing or invalid
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member not found
 */
memberRoutes.get(
  "/:memberId",
  authenticate,
  authorize("admin"),
  memberController.getMemberById,
);

/**
 * @swagger
 * /api/v1/members/{memberId}:
 *   put:
 *     summary: Update member by ID
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Timur
 *               lastName:
 *                 type: string
 *                 example: Karimov
 *               email:
 *                 type: string
 *                 example: tkarimov@academic.rrc.ca
 *               phoneNumber:
 *                 type: string
 *                 example: "2045551234"
 *               dateOfBirth:
 *                 type: string
 *                 example: 1999-04-16T00:00:00.000Z
 *               emergencyContactName:
 *                 type: string
 *                 example: John Karimov
 *               emergencyContactPhoneNumber:
 *                 type: string
 *                 example: "2045559999"
 *               membershipStatus:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *                 example: inactive
 *               joinDate:
 *                 type: string
 *                 example: 2026-04-20T00:00:00.000Z
 *     responses:
 *       200:
 *         description: Member updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authorization token is missing or invalid
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member not found
 */
memberRoutes.put(
  "/:memberId",
  authenticate,
  authorize("admin"),
  memberController.updateMember,
);

/**
 * @swagger
 * /api/v1/members/{memberId}:
 *   delete:
 *     summary: Delete member by ID
 *     tags: [Members]
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
 *         description: Member deleted successfully
 *       401:
 *         description: Authorization token is missing or invalid
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member not found
 */
memberRoutes.delete(
  "/:memberId",
  authenticate,
  authorize("admin"),
  memberController.deleteMember,
);

export default memberRoutes;