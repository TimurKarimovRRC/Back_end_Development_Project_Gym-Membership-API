import { Router } from "express";
import { memberController } from "../controllers/member.controller";

const memberRoutes = Router();

/**
 * @swagger
 * /api/v1/members:
 *   post:
 *     summary: Create a new member
 *     tags:
 *       - Members
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMemberInput'
 *     responses:
 *       201:
 *         description: Member created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 *       400:
 *         description: Validation failed
 *   get:
 *     summary: Get all members
 *     tags:
 *       - Members
 *     responses:
 *       200:
 *         description: A list of members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 */
memberRoutes.post("/", memberController.createMember);
memberRoutes.get("/", memberController.getAllMembers);

/**
 * @swagger
 * /api/v1/members/{memberId}:
 *   get:
 *     summary: Get a member by id
 *     tags:
 *       - Members
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 *       404:
 *         description: Member not found
 *   put:
 *     summary: Update a member by id
 *     tags:
 *       - Members
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMemberInput'
 *     responses:
 *       200:
 *         description: Member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 *       404:
 *         description: Member not found
 *   delete:
 *     summary: Delete a member by id
 *     tags:
 *       - Members
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member deleted successfully
 *       404:
 *         description: Member not found
 */
memberRoutes.get("/:memberId", memberController.getMemberById);
memberRoutes.put("/:memberId", memberController.updateMember);
memberRoutes.delete("/:memberId", memberController.deleteMember);

export default memberRoutes;