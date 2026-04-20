import { getFirestoreDatabase } from "../../../config/firebase";
import { type AdminDashboardStats } from "../types/admin.types";
import { type Member } from "../types/member.types";

const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  const firestoreDatabase = getFirestoreDatabase();

  const membersSnapshot = await firestoreDatabase.collection("members").get();
  const subscriptionsSnapshot = await firestoreDatabase
    .collection("subscriptions")
    .get();
  const visitsSnapshot = await firestoreDatabase.collection("visits").get();

  const members = membersSnapshot.docs.map(
    (memberDocument) => memberDocument.data() as Member,
  );

  const activeMembersCount = members.filter(
    (member) => member.membershipStatus === "active",
  ).length;

  const inactiveMembersCount = members.filter(
    (member) => member.membershipStatus === "inactive",
  ).length;

  const suspendedMembersCount = members.filter(
    (member) => member.membershipStatus === "suspended",
  ).length;

  return {
    totalMembers: membersSnapshot.size,
    totalSubscriptions: subscriptionsSnapshot.size,
    totalVisits: visitsSnapshot.size,
    activeMembersCount,
    inactiveMembersCount,
    suspendedMembersCount,
  };
};

export const adminRepository = {
  getAdminDashboardStats,
};