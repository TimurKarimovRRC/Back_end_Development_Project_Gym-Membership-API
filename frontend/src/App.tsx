import { useEffect, useState } from "react";
import {
  createMember,
  createSubscription,
  createVisit,
  deleteMember,
  getAdminDashboard,
  getExpiringSubscriptions,
  getInactiveMembers,
  getMembers,
  loginWithFirebase,
  sendExpiringSubscriptionReminder,
  sendInactiveMemberReminder,
  updateMember,
  type AdminDashboardResponse,
  type ExpiringSubscriptionsResponse,
  type InactiveMembersResponse,
  type Member,
  type MemberInput,
  type SubscriptionInput,
  type VisitInput,
} from "./api";
import "./App.css";

const initialCreateMemberState: MemberInput = {
  firstName: "Timur",
  lastName: "Karimov",
  email: "tkarimov@academic.rrc.ca",
  phoneNumber: "2045551234",
  dateOfBirth: "1999-04-16T00:00:00.000Z",
  emergencyContactName: "John Karimov",
  emergencyContactPhoneNumber: "2045559999",
  membershipStatus: "active",
  joinDate: new Date().toISOString(),
};

const initialUpdateMemberState = {
  memberId: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  emergencyContactName: "",
  emergencyContactPhoneNumber: "",
  membershipStatus: "active" as MemberInput["membershipStatus"],
  joinDate: "",
};

const initialCreateSubscriptionState: SubscriptionInput = {
  memberId: "",
  planName: "Monthly Premium",
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  price: 49.99,
  isActive: true,
  paymentStatus: "paid",
};

const initialCreateVisitState: VisitInput = {
  memberId: "",
  visitDate: new Date().toISOString(),
  checkInTime: "09:00",
  checkOutTime: "10:00",
  notes: "Workout session",
};

const getInitials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";

const getAvatarColor = (seed: string) => {
  const palette = [
    "#2563eb",
    "#7c3aed",
    "#db2777",
    "#16a34a",
    "#ea580c",
    "#0891b2",
    "#dc2626",
    "#4f46e5",
  ];

  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = seed.charCodeAt(index) + ((hash << 5) - hash);
  }

  return palette[Math.abs(hash) % palette.length];
};

const toDateInputValue = (isoString: string) => {
  if (!isoString) {
    return "";
  }

  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
};

const fromDateInputValue = (dateString: string) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
};

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "gym-api-theme";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
};

interface ToastState {
  type: "success" | "error";
  message: string;
}

const SunIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="16"
    height="16"
  >
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" />
  </svg>
);

function App() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [idToken, setIdToken] = useState("");
  const [signedInEmail, setSignedInEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("Not logged in");
  const [responseOutput, setResponseOutput] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [adminDashboard, setAdminDashboard] = useState<
    AdminDashboardResponse["dashboard"] | null
  >(null);
  const [inactiveMembersData, setInactiveMembersData] =
    useState<InactiveMembersResponse | null>(null);
  const [expiringSubscriptionsData, setExpiringSubscriptionsData] =
    useState<ExpiringSubscriptionsResponse | null>(null);
  const [createMemberState, setCreateMemberState] = useState<MemberInput>(
    initialCreateMemberState,
  );
  const [updateMemberState, setUpdateMemberState] = useState(
    initialUpdateMemberState,
  );
  const [createSubscriptionState, setCreateSubscriptionState] =
    useState<SubscriptionInput>(initialCreateSubscriptionState);
  const [createVisitState, setCreateVisitState] =
    useState<VisitInput>(initialCreateVisitState);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [memberPendingDeletion, setMemberPendingDeletion] =
    useState<Member | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  const showToast = (type: ToastState["type"], message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3500);
  };

  const loadMembers = async () => {
    if (!idToken) {
      setMembers([]);
      return;
    }

    const memberList = await getMembers(idToken);
    setMembers(memberList);
  };

  const loadDashboard = async () => {
    if (!idToken) {
      setAdminDashboard(null);
      return;
    }

    const adminDashboardResponse = await getAdminDashboard(idToken);
    setAdminDashboard(adminDashboardResponse.dashboard);
  };

  const loadInactiveMembers = async () => {
    if (!idToken) {
      setInactiveMembersData(null);
      return;
    }

    const inactiveMembersResponse = await getInactiveMembers(idToken);
    setInactiveMembersData(inactiveMembersResponse);
  };

  const loadExpiringSubscriptions = async () => {
    if (!idToken) {
      setExpiringSubscriptionsData(null);
      return;
    }

    const expiringSubscriptionsResponse =
      await getExpiringSubscriptions(idToken);
    setExpiringSubscriptionsData(expiringSubscriptionsResponse);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      if (!idToken) {
        setMembers([]);
        return;
      }

      try {
        await loadMembers();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load members";
        setMembers([]);
        setResponseOutput(JSON.stringify({ message }, null, 2));
        showToast("error", message);
      }
    };

    void loadInitialData();
  }, [idToken]);

  const handleLogin = async () => {
    setIsLoading(true);
    setAuthMessage("Logging in...");

    try {
      const loginResponse = await loginWithFirebase({
        email: loginEmail,
        password: loginPassword,
      });

      setIdToken(loginResponse.idToken);
      setSignedInEmail(loginResponse.email);
      setAuthMessage(`Logged in as ${loginResponse.email}`);
      setResponseOutput(JSON.stringify(loginResponse, null, 2));
      showToast("success", `Signed in as ${loginResponse.email}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setAuthMessage(message);
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIdToken("");
    setSignedInEmail("");
    setAuthMessage("Not logged in");
    setLoginEmail("");
    setLoginPassword("");
    setMembers([]);
    setAdminDashboard(null);
    setInactiveMembersData(null);
    setExpiringSubscriptionsData(null);
    setSelectedMemberId("");
    setUpdateMemberState(initialUpdateMemberState);
    setCreateSubscriptionState(initialCreateSubscriptionState);
    setCreateVisitState(initialCreateVisitState);
    showToast("success", "Signed out");
  };

  const handleAdminDashboardRequest = async () => {
    if (!idToken) {
      const message = "No token available. Please log in first.";
      setResponseOutput(message);
      showToast("error", message);
      return;
    }

    setIsLoading(true);

    try {
      const adminDashboardResponse = await getAdminDashboard(idToken);
      setAdminDashboard(adminDashboardResponse.dashboard);
      setResponseOutput(JSON.stringify(adminDashboardResponse, null, 2));
      showToast("success", "Admin dashboard loaded");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Admin dashboard request failed";

      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadInactiveMembers = async () => {
    if (!idToken) {
      const message = "No token available. Please log in first.";
      setResponseOutput(message);
      showToast("error", message);
      return;
    }

    setIsLoading(true);

    try {
      const inactiveMembersResponse = await getInactiveMembers(idToken);
      setInactiveMembersData(inactiveMembersResponse);
      setResponseOutput(JSON.stringify(inactiveMembersResponse, null, 2));
      showToast("success", "Inactive members loaded");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Inactive members request failed";

      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInactiveReminder = async (memberId: string) => {
    if (!idToken) {
      const message = "Admin login is required.";
      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
      return;
    }

    setIsLoading(true);

    try {
      const reminderResponse = await sendInactiveMemberReminder(idToken, memberId);
      setResponseOutput(JSON.stringify(reminderResponse, null, 2));
      showToast("success", "Inactive member reminder sent");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Inactive reminder request failed";

      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadExpiringSubscriptions = async () => {
    if (!idToken) {
      const message = "No token available. Please log in first.";
      setResponseOutput(message);
      showToast("error", message);
      return;
    }

    setIsLoading(true);

    try {
      const expiringSubscriptionsResponse =
        await getExpiringSubscriptions(idToken);
      setExpiringSubscriptionsData(expiringSubscriptionsResponse);
      setResponseOutput(JSON.stringify(expiringSubscriptionsResponse, null, 2));
      showToast("success", "Expiring subscriptions loaded");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Expiring subscriptions request failed";

      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendExpiringSubscriptionReminder = async (
    subscriptionId: string,
  ) => {
    if (!idToken) {
      const message = "Admin login is required.";
      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
      return;
    }

    setIsLoading(true);

    try {
      const reminderResponse = await sendExpiringSubscriptionReminder(
        idToken,
        subscriptionId,
      );
      setResponseOutput(JSON.stringify(reminderResponse, null, 2));
      showToast("success", "Subscription reminder sent");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Subscription reminder request failed";

      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMember = async () => {
    if (!idToken) {
      const message = "Admin login is required.";
      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
      return;
    }

    setIsLoading(true);

    try {
      const createMemberResponse = await createMember(idToken, createMemberState);
      setResponseOutput(JSON.stringify(createMemberResponse, null, 2));
      await loadMembers();

      if (adminDashboard) {
        await loadDashboard();
      }

      showToast(
        "success",
        `Created ${createMemberResponse.firstName ?? "member"} ${
          createMemberResponse.lastName ?? ""
        }`.trim(),
      );

      if (createMemberResponse.id) {
        setSelectedMemberId(createMemberResponse.id);
        setUpdateMemberState({
          memberId: createMemberResponse.id,
          firstName: createMemberResponse.firstName ?? "",
          lastName: createMemberResponse.lastName ?? "",
          email: createMemberResponse.email ?? "",
          phoneNumber: createMemberResponse.phoneNumber ?? "",
          dateOfBirth: createMemberResponse.dateOfBirth ?? "",
          emergencyContactName: createMemberResponse.emergencyContactName ?? "",
          emergencyContactPhoneNumber:
            createMemberResponse.emergencyContactPhoneNumber ?? "",
          membershipStatus: createMemberResponse.membershipStatus ?? "active",
          joinDate: createMemberResponse.joinDate ?? "",
        });

        setCreateSubscriptionState((currentState) => ({
          ...currentState,
          memberId: createMemberResponse.id,
        }));

        setCreateVisitState((currentState) => ({
          ...currentState,
          memberId: createMemberResponse.id,
        }));
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Create member request failed";

      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubscription = async () => {
    if (!idToken) {
      const message = "Admin login is required.";
      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
      return;
    }

    if (!createSubscriptionState.memberId) {
      const message = "Select a member for the subscription.";
      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
      return;
    }

    setIsLoading(true);

    try {
      const subscriptionResponse = await createSubscription(
        idToken,
        createSubscriptionState,
      );

      setResponseOutput(JSON.stringify(subscriptionResponse, null, 2));

      if (adminDashboard) {
        await loadDashboard();
      }

      if (expiringSubscriptionsData) {
        await loadExpiringSubscriptions();
      }

      showToast("success", "Subscription created");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Create subscription request failed";

      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVisit = async () => {
    if (!idToken) {
      const message = "Admin login is required.";
      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
      return;
    }

    if (!createVisitState.memberId) {
      const message = "Select a member for the visit.";
      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
      return;
    }

    setIsLoading(true);

    try {
      const visitResponse = await createVisit(idToken, createVisitState);

      setResponseOutput(JSON.stringify(visitResponse, null, 2));

      if (adminDashboard) {
        await loadDashboard();
      }

      if (inactiveMembersData) {
        await loadInactiveMembers();
      }

      showToast("success", "Visit created");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Create visit request failed";

      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMember = (member: Member) => {
    setSelectedMemberId(member.id);
    setUpdateMemberState({
      memberId: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phoneNumber: member.phoneNumber,
      dateOfBirth: member.dateOfBirth,
      emergencyContactName: member.emergencyContactName,
      emergencyContactPhoneNumber: member.emergencyContactPhoneNumber,
      membershipStatus: member.membershipStatus,
      joinDate: member.joinDate,
    });

    setCreateSubscriptionState((currentState) => ({
      ...currentState,
      memberId: member.id,
    }));

    setCreateVisitState((currentState) => ({
      ...currentState,
      memberId: member.id,
    }));

    setResponseOutput(JSON.stringify(member, null, 2));
  };

  const handleClearUpdateForm = () => {
    setSelectedMemberId("");
    setUpdateMemberState(initialUpdateMemberState);
  };

  const handleUpdateMember = async () => {
    if (!idToken) {
      const message = "Admin login is required.";
      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
      return;
    }

    if (!updateMemberState.memberId.trim()) {
      const message = "Member ID is required for update";
      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
      return;
    }

    const updatePayload: Partial<MemberInput> = {
      firstName: updateMemberState.firstName,
      lastName: updateMemberState.lastName,
      email: updateMemberState.email,
      phoneNumber: updateMemberState.phoneNumber,
      dateOfBirth: updateMemberState.dateOfBirth,
      emergencyContactName: updateMemberState.emergencyContactName,
      emergencyContactPhoneNumber:
        updateMemberState.emergencyContactPhoneNumber,
      membershipStatus: updateMemberState.membershipStatus,
      joinDate: updateMemberState.joinDate,
    };

    setIsLoading(true);

    try {
      const updateMemberResponse = await updateMember(
        idToken,
        updateMemberState.memberId,
        updatePayload,
      );

      setResponseOutput(JSON.stringify(updateMemberResponse, null, 2));
      await loadMembers();

      if (adminDashboard) {
        await loadDashboard();
      }

      showToast("success", "Member updated");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Update member request failed";

      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const requestDeleteMember = () => {
    const currentSelectedMember = members.find(
      (member) => member.id === updateMemberState.memberId,
    );

    if (!currentSelectedMember) {
      return;
    }

    setMemberPendingDeletion(currentSelectedMember);
  };

  const cancelDeleteMember = () => {
    if (isDeleting) {
      return;
    }

    setMemberPendingDeletion(null);
  };

  const confirmDeleteMember = async () => {
    if (!idToken) {
      const message = "Admin login is required.";
      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
      return;
    }

    if (!memberPendingDeletion) {
      return;
    }

    setIsDeleting(true);

    try {
      const deleteResponse = await deleteMember(idToken, memberPendingDeletion.id);
      setResponseOutput(JSON.stringify(deleteResponse, null, 2));
      await loadMembers();

      if (adminDashboard) {
        await loadDashboard();
      }

      if (updateMemberState.memberId === memberPendingDeletion.id) {
        handleClearUpdateForm();
      }

      showToast(
        "success",
        `Deleted ${memberPendingDeletion.firstName} ${memberPendingDeletion.lastName}`,
      );
      setMemberPendingDeletion(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Delete member request failed";

      setResponseOutput(JSON.stringify({ message }, null, 2));
      showToast("error", message);
    } finally {
      setIsDeleting(false);
    }
  };

  const updateCreateMemberState = (
    fieldName: keyof MemberInput,
    fieldValue: string,
  ) => {
    setCreateMemberState((currentState) => ({
      ...currentState,
      [fieldName]: fieldValue,
    }));
  };

  const updateEditMemberState = (
    fieldName: keyof typeof initialUpdateMemberState,
    fieldValue: string,
  ) => {
    setUpdateMemberState((currentState) => ({
      ...currentState,
      [fieldName]: fieldValue,
    }));
  };

  const updateCreateSubscriptionState = (
    fieldName: keyof SubscriptionInput,
    fieldValue: string | number | boolean,
  ) => {
    setCreateSubscriptionState((currentState) => ({
      ...currentState,
      [fieldName]: fieldValue,
    }));
  };

  const updateCreateVisitState = (
    fieldName: keyof VisitInput,
    fieldValue: string,
  ) => {
    setCreateVisitState((currentState) => ({
      ...currentState,
      [fieldName]: fieldValue,
    }));
  };

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredMembers = normalizedSearchQuery
    ? members.filter(
        (member) =>
          `${member.firstName} ${member.lastName}`
            .toLowerCase()
            .includes(normalizedSearchQuery) ||
          member.email.toLowerCase().includes(normalizedSearchQuery),
      )
    : members;

  return (
    <div className="page">
      {toast ? (
        <div className={`toast toast-${toast.type}`} role="status">
          <span className="toastIcon" aria-hidden>
            {toast.type === "success" ? "✓" : "!"}
          </span>
          <span>{toast.message}</span>
        </div>
      ) : null}

      {memberPendingDeletion ? (
        <div
          className="modalOverlay"
          onClick={cancelDeleteMember}
          role="presentation"
        >
          <div
            className="modalContent"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <h3 id="delete-dialog-title">Delete member?</h3>
            <p className="modalText">
              You are about to permanently delete{" "}
              <strong>
                {memberPendingDeletion.firstName} {memberPendingDeletion.lastName}
              </strong>
              . This action cannot be undone.
            </p>
            <div className="modalActions">
              <button
                className="secondary"
                onClick={cancelDeleteMember}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="danger"
                onClick={confirmDeleteMember}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="container">
        <header className="hero">
          <div className="heroContent">
            <div>
              <p className="eyebrow">Frontend</p>
              <h1>Gym Membership API</h1>
              <p className="heroText">
                Firebase login, admin authorization, member creation, editing,
                deletion, inactive-member reminders, expiring-subscription
                reminders, plus quick forms for subscriptions and visits.
              </p>
            </div>

            <div className="heroActions">
              <div
                className={`heroStatus ${idToken ? "heroStatusActive" : ""}`}
                aria-live="polite"
              >
                <span className="statusDot" />
                {idToken ? `Signed in · ${signedInEmail}` : "Not authenticated"}
              </div>

              <button
                type="button"
                className="themeToggle"
                onClick={toggleTheme}
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                title={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>
          </div>
        </header>

        <div className="layout">
          <aside className="sidebar">
            <section className="panel">
              <h2>Login</h2>

              {idToken ? (
                <>
                  <div className="statusBox">
                    <p>
                      <strong>Signed in as</strong>
                      <br />
                      {signedInEmail}
                    </p>
                  </div>

                  <button
                    className="secondary"
                    onClick={handleLogout}
                    disabled={isLoading}
                    style={{ marginTop: 14, width: "100%" }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div className="formGrid formGridSingle">
                    <label>
                      Email
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(event) => setLoginEmail(event.target.value)}
                        placeholder="user@gmail.com"
                      />
                    </label>

                    <label>
                      Password
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(event) =>
                          setLoginPassword(event.target.value)
                        }
                        placeholder="Enter password"
                      />
                    </label>
                  </div>

                  <button
                    onClick={handleLogin}
                    disabled={isLoading || !loginEmail || !loginPassword}
                  >
                    {isLoading ? "Signing in..." : "Log In"}
                  </button>

                  <div className="statusBox">
                    <p>
                      <strong>Status:</strong> {authMessage}
                    </p>
                  </div>
                </>
              )}
            </section>

            <section className="panel">
              <h2>Admin Actions</h2>
              <div className="actionGroup">
                <button
                  onClick={handleAdminDashboardRequest}
                  disabled={isLoading || !idToken}
                >
                  Load Dashboard
                </button>
                <button
                  className="secondary"
                  onClick={handleLoadInactiveMembers}
                  disabled={isLoading || !idToken}
                >
                  Load Inactive Members
                </button>
                <button
                  className="secondary"
                  onClick={handleLoadExpiringSubscriptions}
                  disabled={isLoading || !idToken}
                >
                  Load Expiring Subscriptions
                </button>
              </div>
            </section>

            <section className="panel">
              <div className="sectionHeader">
                <h2>Response Output</h2>
                {responseOutput ? (
                  <button
                    className="ghost"
                    onClick={() => {
                      void navigator.clipboard.writeText(responseOutput);
                      showToast("success", "Copied to clipboard");
                    }}
                  >
                    Copy
                  </button>
                ) : null}
              </div>

              <pre>
                {responseOutput || "No response yet. Trigger an API call above."}
              </pre>
            </section>
          </aside>

          <main className="mainContent">
            <section className="panel">
              <div className="sectionHeader">
                <div>
                  <h2>Dashboard Overview</h2>
                  <p className="mutedText">
                    Real values from the admin dashboard endpoint.
                  </p>
                </div>
              </div>

              {adminDashboard ? (
                <div className="dashboardGrid">
                  <div className="statCard">
                    <span className="statLabel">Total Members</span>
                    <strong className="statValue">
                      {adminDashboard.totalMembers}
                    </strong>
                  </div>

                  <div className="statCard">
                    <span className="statLabel">Total Subscriptions</span>
                    <strong className="statValue">
                      {adminDashboard.totalSubscriptions}
                    </strong>
                  </div>

                  <div className="statCard">
                    <span className="statLabel">Total Visits</span>
                    <strong className="statValue">
                      {adminDashboard.totalVisits}
                    </strong>
                  </div>

                  <div className="statCard">
                    <span className="statLabel">Active Members</span>
                    <strong className="statValue">
                      {adminDashboard.activeMembersCount}
                    </strong>
                  </div>

                  <div className="statCard">
                    <span className="statLabel">Inactive Members</span>
                    <strong className="statValue">
                      {adminDashboard.inactiveMembersCount}
                    </strong>
                  </div>

                  <div className="statCard">
                    <span className="statLabel">Suspended Members</span>
                    <strong className="statValue">
                      {adminDashboard.suspendedMembersCount}
                    </strong>
                  </div>
                </div>
              ) : (
                <div className="emptyState">
                  <p>
                    <strong>Dashboard not loaded yet.</strong>
                  </p>
                  <p className="mutedText">
                    Sign in as admin and click <code>Load Dashboard</code>.
                  </p>
                </div>
              )}
            </section>

            <section className="panel">
              <div className="sectionHeader">
                <div>
                  <h2>
                    Inactive Members{" "}
                    <span className="countBadge">
                      {inactiveMembersData?.totalInactiveMembers ?? 0}
                    </span>
                  </h2>
                  <p className="mutedText">
                    Members with no visits in the last{" "}
                    <code>{inactiveMembersData?.thresholdDays ?? 14}</code> days.
                  </p>
                </div>
              </div>

              {inactiveMembersData ? (
                inactiveMembersData.members.length > 0 ? (
                  <div className="memberList">
                    {inactiveMembersData.members.map((member) => (
                      <div key={member.memberId} className="memberCard">
                        <div
                          className="memberAvatar"
                          style={{
                            backgroundColor: getAvatarColor(
                              `${member.firstName}${member.lastName}${member.memberId}`,
                            ),
                          }}
                        >
                          {getInitials(member.firstName, member.lastName)}
                        </div>

                        <div className="memberInfo">
                          <div className="memberCardTop">
                            <strong>
                              {member.firstName} {member.lastName}
                            </strong>
                            <span
                              className={`memberBadge memberBadge-${member.membershipStatus}`}
                            >
                              {member.membershipStatus}
                            </span>
                          </div>

                          <span className="memberEmail">{member.email}</span>

                          <small className="memberId">
                            {member.lastVisitDate
                              ? `Last visit: ${toDateInputValue(member.lastVisitDate)} · ${member.daysSinceLastVisit} days ago`
                              : "No visits recorded yet"}
                          </small>

                          <div className="actionGroup">
                            <button
                              className="secondary"
                              onClick={() =>
                                handleSendInactiveReminder(member.memberId)
                              }
                              disabled={isLoading || !idToken}
                            >
                              Send Reminder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="emptyState">
                    <p>
                      <strong>No inactive members found.</strong>
                    </p>
                  </div>
                )
              ) : (
                <div className="emptyState">
                  <p>
                    <strong>Inactive members not loaded yet.</strong>
                  </p>
                  <p className="mutedText">
                    Click <code>Load Inactive Members</code>.
                  </p>
                </div>
              )}
            </section>

            <section className="panel">
              <div className="sectionHeader">
                <div>
                  <h2>
                    Expiring Subscriptions{" "}
                    <span className="countBadge">
                      {expiringSubscriptionsData?.totalExpiringSubscriptions ?? 0}
                    </span>
                  </h2>
                  <p className="mutedText">
                    Active subscriptions ending within{" "}
                    <code>{expiringSubscriptionsData?.thresholdDays ?? 7}</code>{" "}
                    days.
                  </p>
                </div>
              </div>

              {expiringSubscriptionsData ? (
                expiringSubscriptionsData.subscriptions.length > 0 ? (
                  <div className="memberList">
                    {expiringSubscriptionsData.subscriptions.map((subscription) => (
                      <div key={subscription.subscriptionId} className="memberCard">
                        <div
                          className="memberAvatar"
                          style={{
                            backgroundColor: getAvatarColor(
                              `${subscription.firstName}${subscription.lastName}${subscription.subscriptionId}`,
                            ),
                          }}
                        >
                          {getInitials(subscription.firstName, subscription.lastName)}
                        </div>

                        <div className="memberInfo">
                          <div className="memberCardTop">
                            <strong>
                              {subscription.firstName} {subscription.lastName}
                            </strong>
                            <span className="memberBadge memberBadge-active">
                              {subscription.planName}
                            </span>
                          </div>

                          <span className="memberEmail">{subscription.email}</span>

                          <small className="memberId">
                            Ends on {toDateInputValue(subscription.endDate)} ·{" "}
                            {subscription.daysUntilEnd} day(s) left ·{" "}
                            {subscription.paymentStatus}
                          </small>

                          <div className="actionGroup">
                            <button
                              className="secondary"
                              onClick={() =>
                                handleSendExpiringSubscriptionReminder(
                                  subscription.subscriptionId,
                                )
                              }
                              disabled={isLoading || !idToken}
                            >
                              Send Reminder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="emptyState">
                    <p>
                      <strong>No expiring subscriptions found.</strong>
                    </p>
                  </div>
                )
              ) : (
                <div className="emptyState">
                  <p>
                    <strong>Expiring subscriptions not loaded yet.</strong>
                  </p>
                  <p className="mutedText">
                    Click <code>Load Expiring Subscriptions</code>.
                  </p>
                </div>
              )}
            </section>

            <section className="panel">
              <div className="sectionHeader">
                <div>
                  <h2>
                    Members <span className="countBadge">{members.length}</span>
                  </h2>
                  <p className="mutedText">
                    Click a member to load their data into the edit form and test
                    forms below.
                  </p>
                </div>

                <button
                  className="secondary"
                  onClick={() => void loadMembers()}
                  disabled={isLoading || !idToken}
                >
                  {isLoading ? "Loading..." : "Refresh"}
                </button>
              </div>

              <div className="searchWrap">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by name or email..."
                  disabled={!idToken}
                />
              </div>

              <div className="memberList">
                {!idToken ? (
                  <div className="emptyState">
                    <p>
                      <strong>Login required.</strong>
                    </p>
                    <p className="mutedText">
                      Sign in as an admin to load members.
                    </p>
                  </div>
                ) : null}

                {idToken &&
                  filteredMembers.map((member) => (
                    <button
                      key={member.id}
                      className={`memberCard ${
                        selectedMemberId === member.id ? "memberCardActive" : ""
                      }`}
                      onClick={() => handleSelectMember(member)}
                    >
                      <div
                        className="memberAvatar"
                        style={{
                          backgroundColor: getAvatarColor(
                            `${member.firstName}${member.lastName}${member.id}`,
                          ),
                        }}
                      >
                        {getInitials(member.firstName, member.lastName)}
                      </div>

                      <div className="memberInfo">
                        <div className="memberCardTop">
                          <strong>
                            {member.firstName} {member.lastName}
                          </strong>
                          <span
                            className={`memberBadge memberBadge-${member.membershipStatus}`}
                          >
                            {member.membershipStatus}
                          </span>
                        </div>

                        <span className="memberEmail">{member.email}</span>
                        <small className="memberId" title={member.id}>
                          ID: {member.id}
                        </small>
                      </div>
                    </button>
                  ))}

                {idToken && members.length === 0 ? (
                  <div className="emptyState">
                    <p>
                      <strong>No members yet.</strong>
                    </p>
                    <p className="mutedText">
                      Create the first member using the form below.
                    </p>
                  </div>
                ) : null}

                {idToken && members.length > 0 && filteredMembers.length === 0 ? (
                  <div className="emptyState">
                    <p>
                      No members match "<strong>{searchQuery}</strong>".
                    </p>
                  </div>
                ) : null}
              </div>
            </section>

            <div className="formRow">
              <section className="panel">
                <h2>Create Member</h2>
                <p className="mutedText">Admin login is required.</p>

                <p className="fieldGroupLabel">Personal Info</p>
                <div className="formGrid">
                  <label>
                    First Name
                    <input
                      value={createMemberState.firstName}
                      onChange={(event) =>
                        updateCreateMemberState("firstName", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Last Name
                    <input
                      value={createMemberState.lastName}
                      onChange={(event) =>
                        updateCreateMemberState("lastName", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Date of Birth
                    <input
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      value={toDateInputValue(createMemberState.dateOfBirth)}
                      onChange={(event) =>
                        updateCreateMemberState(
                          "dateOfBirth",
                          fromDateInputValue(event.target.value),
                        )
                      }
                    />
                  </label>
                </div>

                <p className="fieldGroupLabel">Contact</p>
                <div className="formGrid">
                  <label>
                    Email
                    <input
                      type="email"
                      value={createMemberState.email}
                      onChange={(event) =>
                        updateCreateMemberState("email", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Phone Number
                    <input
                      type="tel"
                      value={createMemberState.phoneNumber}
                      onChange={(event) =>
                        updateCreateMemberState("phoneNumber", event.target.value)
                      }
                    />
                  </label>
                </div>

                <p className="fieldGroupLabel">Emergency Contact</p>
                <div className="formGrid">
                  <label>
                    Name
                    <input
                      value={createMemberState.emergencyContactName}
                      onChange={(event) =>
                        updateCreateMemberState(
                          "emergencyContactName",
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Phone Number
                    <input
                      type="tel"
                      value={createMemberState.emergencyContactPhoneNumber}
                      onChange={(event) =>
                        updateCreateMemberState(
                          "emergencyContactPhoneNumber",
                          event.target.value,
                        )
                      }
                    />
                  </label>
                </div>

                <p className="fieldGroupLabel">Membership</p>
                <div className="formGrid">
                  <label>
                    Status
                    <select
                      value={createMemberState.membershipStatus}
                      onChange={(event) =>
                        updateCreateMemberState(
                          "membershipStatus",
                          event.target.value as MemberInput["membershipStatus"],
                        )
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </label>

                  <label>
                    Join Date
                    <input
                      type="date"
                      value={toDateInputValue(createMemberState.joinDate)}
                      onChange={(event) =>
                        updateCreateMemberState(
                          "joinDate",
                          fromDateInputValue(event.target.value),
                        )
                      }
                    />
                  </label>
                </div>

                <button
                  onClick={handleCreateMember}
                  disabled={isLoading || !idToken}
                >
                  {isLoading ? "Creating..." : "Create Member"}
                </button>
              </section>

              <section className="panel">
                <div className="sectionHeader">
                  <h2>
                    {updateMemberState.memberId ? "Edit Member" : "Update Member"}
                  </h2>

                  {updateMemberState.memberId ? (
                    <button
                      className="ghost"
                      onClick={handleClearUpdateForm}
                      disabled={isLoading}
                    >
                      Clear
                    </button>
                  ) : null}
                </div>

                <p className="mutedText">Admin login is required.</p>

                {!updateMemberState.memberId ? (
                  <p className="mutedText">
                    Select a member from the list above to edit.
                  </p>
                ) : null}

                <p className="fieldGroupLabel">Member ID</p>
                <div className="formGrid formGridSingle">
                  <label>
                    <input
                      value={updateMemberState.memberId}
                      onChange={(event) =>
                        updateEditMemberState("memberId", event.target.value)
                      }
                      placeholder="Select member from the list"
                      readOnly
                    />
                  </label>
                </div>

                <p className="fieldGroupLabel">Personal Info</p>
                <div className="formGrid">
                  <label>
                    First Name
                    <input
                      value={updateMemberState.firstName}
                      onChange={(event) =>
                        updateEditMemberState("firstName", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Last Name
                    <input
                      value={updateMemberState.lastName}
                      onChange={(event) =>
                        updateEditMemberState("lastName", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Date of Birth
                    <input
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      value={toDateInputValue(updateMemberState.dateOfBirth)}
                      onChange={(event) =>
                        updateEditMemberState(
                          "dateOfBirth",
                          fromDateInputValue(event.target.value),
                        )
                      }
                    />
                  </label>
                </div>

                <p className="fieldGroupLabel">Contact</p>
                <div className="formGrid">
                  <label>
                    Email
                    <input
                      type="email"
                      value={updateMemberState.email}
                      onChange={(event) =>
                        updateEditMemberState("email", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Phone Number
                    <input
                      type="tel"
                      value={updateMemberState.phoneNumber}
                      onChange={(event) =>
                        updateEditMemberState("phoneNumber", event.target.value)
                      }
                    />
                  </label>
                </div>

                <p className="fieldGroupLabel">Emergency Contact</p>
                <div className="formGrid">
                  <label>
                    Name
                    <input
                      value={updateMemberState.emergencyContactName}
                      onChange={(event) =>
                        updateEditMemberState(
                          "emergencyContactName",
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Phone Number
                    <input
                      type="tel"
                      value={updateMemberState.emergencyContactPhoneNumber}
                      onChange={(event) =>
                        updateEditMemberState(
                          "emergencyContactPhoneNumber",
                          event.target.value,
                        )
                      }
                    />
                  </label>
                </div>

                <p className="fieldGroupLabel">Membership</p>
                <div className="formGrid">
                  <label>
                    Status
                    <select
                      value={updateMemberState.membershipStatus}
                      onChange={(event) =>
                        updateEditMemberState(
                          "membershipStatus",
                          event.target.value,
                        )
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </label>

                  <label>
                    Join Date
                    <input
                      type="date"
                      value={toDateInputValue(updateMemberState.joinDate)}
                      onChange={(event) =>
                        updateEditMemberState(
                          "joinDate",
                          fromDateInputValue(event.target.value),
                        )
                      }
                    />
                  </label>
                </div>

                <div className="actionGroup">
                  <button
                    onClick={handleUpdateMember}
                    disabled={isLoading || !idToken || !updateMemberState.memberId}
                  >
                    {isLoading ? "Saving..." : "Update Member"}
                  </button>

                  <button
                    type="button"
                    className="danger"
                    onClick={requestDeleteMember}
                    disabled={isLoading || !idToken || !updateMemberState.memberId}
                    aria-label="Delete member"
                  >
                    <TrashIcon />
                    <span>Delete</span>
                  </button>
                </div>
              </section>
            </div>

            <div className="formRow">
              <section className="panel">
                <h2>Create Subscription</h2>
                <p className="mutedText">
                  Use this to test expiring subscriptions and reminder emails.
                </p>

                <div className="formGrid">
                  <label>
                    Member
                    <select
                      value={createSubscriptionState.memberId}
                      onChange={(event) =>
                        updateCreateSubscriptionState("memberId", event.target.value)
                      }
                    >
                      <option value="">Select member</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.firstName} {member.lastName}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Plan Name
                    <input
                      value={createSubscriptionState.planName}
                      onChange={(event) =>
                        updateCreateSubscriptionState("planName", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Start Date
                    <input
                      type="date"
                      value={toDateInputValue(createSubscriptionState.startDate)}
                      onChange={(event) =>
                        updateCreateSubscriptionState(
                          "startDate",
                          fromDateInputValue(event.target.value),
                        )
                      }
                    />
                  </label>

                  <label>
                    End Date
                    <input
                      type="date"
                      value={toDateInputValue(createSubscriptionState.endDate)}
                      onChange={(event) =>
                        updateCreateSubscriptionState(
                          "endDate",
                          fromDateInputValue(event.target.value),
                        )
                      }
                    />
                  </label>

                  <label>
                    Price
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={createSubscriptionState.price}
                      onChange={(event) =>
                        updateCreateSubscriptionState(
                          "price",
                          Number(event.target.value),
                        )
                      }
                    />
                  </label>

                  <label>
                    Payment Status
                    <select
                      value={createSubscriptionState.paymentStatus}
                      onChange={(event) =>
                        updateCreateSubscriptionState(
                          "paymentStatus",
                          event.target.value,
                        )
                      }
                    >
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </label>

                  <label>
                    Is Active
                    <select
                      value={createSubscriptionState.isActive ? "true" : "false"}
                      onChange={(event) =>
                        updateCreateSubscriptionState(
                          "isActive",
                          event.target.value === "true",
                        )
                      }
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </label>
                </div>

                <button
                  onClick={handleCreateSubscription}
                  disabled={isLoading || !idToken}
                >
                  {isLoading ? "Creating..." : "Create Subscription"}
                </button>
              </section>

              <section className="panel">
                <h2>Create Visit</h2>
                <p className="mutedText">
                  Use this to test inactive members and reminder emails.
                </p>

                <div className="formGrid">
                  <label>
                    Member
                    <select
                      value={createVisitState.memberId}
                      onChange={(event) =>
                        updateCreateVisitState("memberId", event.target.value)
                      }
                    >
                      <option value="">Select member</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.firstName} {member.lastName}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Visit Date
                    <input
                      type="date"
                      value={toDateInputValue(createVisitState.visitDate)}
                      onChange={(event) =>
                        updateCreateVisitState(
                          "visitDate",
                          fromDateInputValue(event.target.value),
                        )
                      }
                    />
                  </label>

                  <label>
                    Check In Time
                    <input
                      type="time"
                      value={createVisitState.checkInTime}
                      onChange={(event) =>
                        updateCreateVisitState("checkInTime", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Check Out Time
                    <input
                      type="time"
                      value={createVisitState.checkOutTime}
                      onChange={(event) =>
                        updateCreateVisitState("checkOutTime", event.target.value)
                      }
                    />
                  </label>

                  <label className="formGridSingle">
                    Notes
                    <textarea
                      rows={4}
                      value={createVisitState.notes}
                      onChange={(event) =>
                        updateCreateVisitState("notes", event.target.value)
                      }
                    />
                  </label>
                </div>

                <button
                  onClick={handleCreateVisit}
                  disabled={isLoading || !idToken}
                >
                  {isLoading ? "Creating..." : "Create Visit"}
                </button>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;