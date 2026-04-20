import { getFirestoreDatabase } from "../../../config/firebase";
import {
  type AdminDashboardStats,
  type ExpiringSubscriptionSummary,
  type ExpiringSubscriptionsResponse,
  type InactiveMemberSummary,
  type InactiveMembersResponse,
} from "../types/admin.types";
import { type Member } from "../types/member.types";
import { type Subscription } from "../types/subscription.types";
import { type Visit } from "../types/visit.types";

const inactiveMemberThresholdDays = 14;
const expiringSubscriptionThresholdDays = 7;

const getDaysSinceDate = (dateString: string): number | null => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const differenceInMilliseconds = Date.now() - date.getTime();

  return Math.max(0, Math.floor(differenceInMilliseconds / millisecondsPerDay));
};

const getDaysUntilDate = (dateString: string): number | null => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const differenceInMilliseconds = date.getTime() - Date.now();

  return Math.max(0, Math.ceil(differenceInMilliseconds / millisecondsPerDay));
};

const buildLatestVisitByMemberIdMap = (visits: Visit[]): Map<string, string> => {
  const latestVisitByMemberId = new Map<string, string>();

  for (const visit of visits) {
    const currentLatestVisitDate = latestVisitByMemberId.get(visit.memberId);

    if (
      !currentLatestVisitDate ||
      new Date(visit.visitDate).getTime() > new Date(currentLatestVisitDate).getTime()
    ) {
      latestVisitByMemberId.set(visit.memberId, visit.visitDate);
    }
  }

  return latestVisitByMemberId;
};

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

const getInactiveMembers = async (): Promise<InactiveMembersResponse> => {
  const firestoreDatabase = getFirestoreDatabase();

  const membersSnapshot = await firestoreDatabase.collection("members").get();
  const visitsSnapshot = await firestoreDatabase.collection("visits").get();

  const members = membersSnapshot.docs.map(
    (memberDocument) => memberDocument.data() as Member,
  );
  const visits = visitsSnapshot.docs.map(
    (visitDocument) => visitDocument.data() as Visit,
  );

  const latestVisitByMemberId = buildLatestVisitByMemberIdMap(visits);

  const inactiveMembers: InactiveMemberSummary[] = members
    .map((member) => {
      const lastVisitDate = latestVisitByMemberId.get(member.id) ?? null;
      const daysSinceLastVisit = lastVisitDate
        ? getDaysSinceDate(lastVisitDate)
        : null;

      return {
        memberId: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        membershipStatus: member.membershipStatus,
        lastVisitDate,
        daysSinceLastVisit,
      };
    })
    .filter((member) => {
      if (member.lastVisitDate === null) {
        return true;
      }

      if (member.daysSinceLastVisit === null) {
        return false;
      }

      return member.daysSinceLastVisit >= inactiveMemberThresholdDays;
    })
    .sort((firstMember, secondMember) => {
      const firstValue =
        firstMember.daysSinceLastVisit === null
          ? Number.MAX_SAFE_INTEGER
          : firstMember.daysSinceLastVisit;

      const secondValue =
        secondMember.daysSinceLastVisit === null
          ? Number.MAX_SAFE_INTEGER
          : secondMember.daysSinceLastVisit;

      return secondValue - firstValue;
    });

  return {
    thresholdDays: inactiveMemberThresholdDays,
    totalInactiveMembers: inactiveMembers.length,
    members: inactiveMembers,
  };
};

const getExpiringSubscriptions =
  async (): Promise<ExpiringSubscriptionsResponse> => {
    const firestoreDatabase = getFirestoreDatabase();

    const membersSnapshot = await firestoreDatabase.collection("members").get();
    const subscriptionsSnapshot = await firestoreDatabase
      .collection("subscriptions")
      .get();

    const members = membersSnapshot.docs.map(
      (memberDocument) => memberDocument.data() as Member,
    );
    const subscriptions = subscriptionsSnapshot.docs.map(
      (subscriptionDocument) => subscriptionDocument.data() as Subscription,
    );

    const memberById = new Map<string, Member>();

    for (const member of members) {
      memberById.set(member.id, member);
    }

    const expiringSubscriptions: ExpiringSubscriptionSummary[] = [];

    for (const subscription of subscriptions) {
      const member = memberById.get(subscription.memberId);

      if (!member) {
        continue;
      }

      const daysUntilEnd = getDaysUntilDate(subscription.endDate);

      if (daysUntilEnd === null) {
        continue;
      }

      if (!subscription.isActive) {
        continue;
      }

      if (daysUntilEnd > expiringSubscriptionThresholdDays) {
        continue;
      }

      const expiringSubscription: ExpiringSubscriptionSummary = {
        subscriptionId: subscription.id,
        memberId: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        planName: subscription.planName,
        endDate: subscription.endDate,
        daysUntilEnd,
        paymentStatus: subscription.paymentStatus,
        isActive: subscription.isActive,
      };

      expiringSubscriptions.push(expiringSubscription);
    }

    expiringSubscriptions.sort(
      (firstSubscription, secondSubscription) =>
        firstSubscription.daysUntilEnd - secondSubscription.daysUntilEnd,
    );

    return {
      thresholdDays: expiringSubscriptionThresholdDays,
      totalExpiringSubscriptions: expiringSubscriptions.length,
      subscriptions: expiringSubscriptions,
    };
  };

export const adminRepository = {
  getAdminDashboardStats,
  getInactiveMembers,
  getExpiringSubscriptions,
};