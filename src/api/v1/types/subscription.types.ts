export interface Subscription {
  id: string;
  memberId: string;
  planName: string;
  startDate: string;
  endDate: string;
  price: number;
  isActive: boolean;
  paymentStatus: "paid" | "unpaid" | "overdue";
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionInput {
  memberId: string;
  planName: string;
  startDate: string;
  endDate: string;
  price: number;
  isActive: boolean;
  paymentStatus: "paid" | "unpaid" | "overdue";
}

export interface UpdateSubscriptionInput {
  memberId?: string;
  planName?: string;
  startDate?: string;
  endDate?: string;
  price?: number;
  isActive?: boolean;
  paymentStatus?: "paid" | "unpaid" | "overdue";
}