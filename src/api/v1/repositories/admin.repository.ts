import { getFirestoreDatabase } from "../../../config/firebase";
import { type AdminDashboardStats } from "../types/admin.types";

const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  const firestoreDatabase = getFirestoreDatabase();

  const membersSnapshot = await firestoreDatabase.collection("members").get();
  const subscriptionsSnapshot = await firestoreDatabase
    .collection("subscriptions")
    .get();
  const visitsSnapshot = await firestoreDatabase.collection("visits").get();

  return {
    totalMembers: membersSnapshot.size,
    totalSubscriptions: subscriptionsSnapshot.size,
    totalVisits: visitsSnapshot.size,
  };
};

export const adminRepository = {
  getAdminDashboardStats,
};