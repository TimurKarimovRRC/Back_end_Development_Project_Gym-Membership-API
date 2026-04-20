export interface AdminDashboardStats {
  totalMembers: number;
  totalSubscriptions: number;
  totalVisits: number;
  activeMembersCount: number;
  inactiveMembersCount: number;
  suspendedMembersCount: number;
}

export interface InactiveMemberSummary {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipStatus: "active" | "inactive" | "suspended";
  lastVisitDate: string | null;
  daysSinceLastVisit: number | null;
}

export interface InactiveMembersResponse {
  thresholdDays: number;
  totalInactiveMembers: number;
  members: InactiveMemberSummary[];
}

export interface ExpiringSubscriptionSummary {
  subscriptionId: string;
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  planName: string;
  endDate: string;
  daysUntilEnd: number;
  paymentStatus: string;
  isActive: boolean;
}

export interface ExpiringSubscriptionsResponse {
  thresholdDays: number;
  totalExpiringSubscriptions: number;
  subscriptions: ExpiringSubscriptionSummary[];
}