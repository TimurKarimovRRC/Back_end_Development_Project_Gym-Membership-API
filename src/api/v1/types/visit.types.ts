export interface Visit {
  id: string;
  memberId: string;
  visitDate: string;
  checkInTime: string;
  checkOutTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisitInput {
  memberId: string;
  visitDate: string;
  checkInTime: string;
  checkOutTime?: string;
  notes?: string;
}

export interface UpdateVisitInput {
  memberId?: string;
  visitDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
}