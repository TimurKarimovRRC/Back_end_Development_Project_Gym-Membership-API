const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const firebaseWebApiKey = import.meta.env.VITE_FIREBASE_WEB_API_KEY;

interface FirebaseLoginResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export interface MemberInput {
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

export interface Member extends MemberInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboardResponse {
  message: string;
  dashboard: {
    totalMembers: number;
    totalSubscriptions: number;
    totalVisits: number;
    activeMembersCount: number;
    inactiveMembersCount: number;
    suspendedMembersCount: number;
  };
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

const parseJsonResponse = async (response: Response) => {
  const responseText = await response.text();

  try {
    return responseText ? JSON.parse(responseText) : {};
  } catch {
    return { message: responseText || "Unknown response format" };
  }
};

const getAuthorizedHeaders = (idToken: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${idToken}`,
});

export const loginWithFirebase = async ({
  email,
  password,
}: LoginInput): Promise<FirebaseLoginResponse> => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseWebApiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    },
  );

  const responseData = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      responseData.error?.message || "Failed to log in with Firebase",
    );
  }

  return responseData as FirebaseLoginResponse;
};

export const getAdminDashboard = async (
  idToken: string,
): Promise<AdminDashboardResponse> => {
  const response = await fetch(`${apiBaseUrl}/api/v1/admin/dashboard`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  const responseData = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to load admin dashboard");
  }

  return responseData as AdminDashboardResponse;
};

export const getInactiveMembers = async (
  idToken: string,
): Promise<InactiveMembersResponse> => {
  const response = await fetch(`${apiBaseUrl}/api/v1/admin/inactive-members`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  const responseData = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to load inactive members");
  }

  return responseData as InactiveMembersResponse;
};

export const sendInactiveMemberReminder = async (
  idToken: string,
  memberId: string,
) => {
  const response = await fetch(
    `${apiBaseUrl}/api/v1/admin/inactive-members/${memberId}/reminder`,
    {
      method: "POST",
      headers: getAuthorizedHeaders(idToken),
    },
  );

  const responseData = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      responseData.message || "Failed to send inactive member reminder",
    );
  }

  return responseData;
};

export const getMembers = async (idToken: string): Promise<Member[]> => {
  const response = await fetch(`${apiBaseUrl}/api/v1/members`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  const responseData = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to load members");
  }

  return responseData as Member[];
};

export const createMember = async (
  idToken: string,
  memberInput: MemberInput,
) => {
  const response = await fetch(`${apiBaseUrl}/api/v1/members`, {
    method: "POST",
    headers: getAuthorizedHeaders(idToken),
    body: JSON.stringify(memberInput),
  });

  const responseData = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to create member");
  }

  return responseData;
};

export const updateMember = async (
  idToken: string,
  memberId: string,
  memberInput: Partial<MemberInput>,
) => {
  const response = await fetch(`${apiBaseUrl}/api/v1/members/${memberId}`, {
    method: "PUT",
    headers: getAuthorizedHeaders(idToken),
    body: JSON.stringify(memberInput),
  });

  const responseData = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to update member");
  }

  return responseData;
};

export const deleteMember = async (idToken: string, memberId: string) => {
  const response = await fetch(`${apiBaseUrl}/api/v1/members/${memberId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  const responseData = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to delete member");
  }

  return responseData;
};