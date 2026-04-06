import { Router } from "express";
import { HTTP_STATUS } from "../../../constants/httpStatus";

const healthRoutes = Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Check API health status
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API health information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
healthRoutes.get("/", (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

export default healthRoutes;