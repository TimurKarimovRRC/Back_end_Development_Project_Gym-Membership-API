import { HTTP_STATUS } from "../../../constants/httpStatus";
import AppError from "../errors/AppError";
import { adminRepository } from "../repositories/admin.repository";
import { emailService } from "./email.service";
import {
  type AdminDashboardStats,
  type InactiveMemberSummary,
  type InactiveMembersResponse,
} from "../types/admin.types";

const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  return adminRepository.getAdminDashboardStats();
};

const getInactiveMembers = async (): Promise<InactiveMembersResponse> => {
  return adminRepository.getInactiveMembers();
};

const sendInactiveMemberReminder = async (
  memberId: string,
): Promise<InactiveMemberSummary> => {
  const inactiveMembersResponse = await adminRepository.getInactiveMembers();

  const inactiveMember = inactiveMembersResponse.members.find(
    (member) => member.memberId === memberId,
  );

  if (!inactiveMember) {
    throw new AppError("Inactive member not found", HTTP_STATUS.NOT_FOUND);
  }

  if (!emailService.isEmailConfigurationAvailable()) {
    throw new AppError(
      "Email configuration is not available",
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  await emailService.sendInactiveMemberReminderEmail(
    inactiveMember.email,
    inactiveMember.firstName,
    inactiveMember.daysSinceLastVisit,
  );

  return inactiveMember;
};

export const adminService = {
  getAdminDashboardStats,
  getInactiveMembers,
  sendInactiveMemberReminder,
};