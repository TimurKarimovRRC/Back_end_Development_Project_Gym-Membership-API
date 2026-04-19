import { type NextFunction, type Request, type Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpStatus";
import { adminService } from "../services/admin.service";

const getAdminDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const dashboardStats = await adminService.getAdminDashboardStats();

    res.status(HTTP_STATUS.OK).json({
      message: "Admin access granted",
      dashboard: dashboardStats,
    });
  } catch (error) {
    next(error);
  }
};

export const adminController = {
  getAdminDashboard,
};