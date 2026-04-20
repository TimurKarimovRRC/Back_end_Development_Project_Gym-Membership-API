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

const getInactiveMembers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const inactiveMembersResponse = await adminService.getInactiveMembers();

    res.status(HTTP_STATUS.OK).json(inactiveMembersResponse);
  } catch (error) {
    next(error);
  }
};

const sendInactiveMemberReminder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const inactiveMember = await adminService.sendInactiveMemberReminder(
      req.params.memberId,
    );

    res.status(HTTP_STATUS.OK).json({
      message: `Inactive reminder sent to ${inactiveMember.email}`,
      member: inactiveMember,
    });
  } catch (error) {
    next(error);
  }
};

export const adminController = {
  getAdminDashboard,
  getInactiveMembers,
  sendInactiveMemberReminder,
};