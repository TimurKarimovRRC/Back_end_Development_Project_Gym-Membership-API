export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  emergencyContactName: string;
  emergencyContactPhoneNumber: string;
  membershipStatus: "active" | "inactive" | "suspended";
  joinDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemberInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  emergencyContactName: string;
  emergencyContactPhoneNumber: string;
  membershipStatus: "active" | "inactive" | "suspended";
  joinDate: string;
}

export interface UpdateMemberInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  emergencyContactName?: string;
  emergencyContactPhoneNumber?: string;
  membershipStatus?: "active" | "inactive" | "suspended";
  joinDate?: string;
}