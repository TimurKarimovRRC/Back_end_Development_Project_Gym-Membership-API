import { adminRepository } from "../repositories/admin.repository";
import { type AdminDashboardStats } from "../types/admin.types";

const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  return adminRepository.getAdminDashboardStats();
};

export const adminService = {
  getAdminDashboardStats,
};