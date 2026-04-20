import { type NextFunction, type Request, type Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpStatus";
import AppError from "../errors/AppError";
import { adminService } from "../services/admin.service";

const getSingleRouteParam = (
  routeParam: string | string[] | undefined,
  parameterName: string,
): string => {
  if (typeof routeParam === "string" && routeParam.trim()) {
    return routeParam;
  }

  if (Array.isArray(routeParam) && routeParam.length > 0) {
    return routeParam[0];
  }

  throw new AppError(
    `Missing required route parameter: ${parameterName}`,
    HTTP_STATUS.BAD_REQUEST,
  );
};

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
    const memberId = getSingleRouteParam(req.params.memberId, "memberId");

    const inactiveMember = await adminService.sendInactiveMemberReminder(
      memberId,
    );

    res.status(HTTP_STATUS.OK).json({
      message: `Inactive reminder sent to ${inactiveMember.email}`,
      member: inactiveMember,
    });
  } catch (error) {
    next(error);
  }
};

const getExpiringSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const expiringSubscriptionsResponse =
      await adminService.getExpiringSubscriptions();

    res.status(HTTP_STATUS.OK).json(expiringSubscriptionsResponse);
  } catch (error) {
    next(error);
  }
};

const sendExpiringSubscriptionReminder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const subscriptionId = getSingleRouteParam(
      req.params.subscriptionId,
      "subscriptionId",
    );

    const expiringSubscription =
      await adminService.sendExpiringSubscriptionReminder(subscriptionId);

    res.status(HTTP_STATUS.OK).json({
      message: `Subscription reminder sent to ${expiringSubscription.email}`,
      subscription: expiringSubscription,
    });
  } catch (error) {
    next(error);
  }
};

export const adminController = {
  getAdminDashboard,
  getInactiveMembers,
  sendInactiveMemberReminder,
  getExpiringSubscriptions,
  sendExpiringSubscriptionReminder,
};