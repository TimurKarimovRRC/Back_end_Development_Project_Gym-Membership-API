import { Router } from "express";
import { visitController } from "../controllers/visit.controller";

const visitRoutes = Router();

/**
 * @swagger
 * /api/v1/visits:
 *   post:
 *     summary: Create a new visit
 *     tags:
 *       - Visits
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVisitInput'
 *     responses:
 *       201:
 *         description: Visit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visit'
 *   get:
 *     summary: Get all visits
 *     tags:
 *       - Visits
 *     responses:
 *       200:
 *         description: A list of visits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Visit'
 */
visitRoutes.post("/", visitController.createVisit);
visitRoutes.get("/", visitController.getAllVisits);

/**
 * @swagger
 * /api/v1/visits/{visitId}:
 *   get:
 *     summary: Get a visit by id
 *     tags:
 *       - Visits
 *     parameters:
 *       - in: path
 *         name: visitId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visit found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visit'
 *       404:
 *         description: Visit not found
 *   put:
 *     summary: Update a visit by id
 *     tags:
 *       - Visits
 *     parameters:
 *       - in: path
 *         name: visitId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVisitInput'
 *     responses:
 *       200:
 *         description: Visit updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visit'
 *       404:
 *         description: Visit not found
 *   delete:
 *     summary: Delete a visit by id
 *     tags:
 *       - Visits
 *     parameters:
 *       - in: path
 *         name: visitId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visit deleted successfully
 *       404:
 *         description: Visit not found
 */
visitRoutes.get("/:visitId", visitController.getVisitById);
visitRoutes.put("/:visitId", visitController.updateVisit);
visitRoutes.delete("/:visitId", visitController.deleteVisit);

export default visitRoutes;