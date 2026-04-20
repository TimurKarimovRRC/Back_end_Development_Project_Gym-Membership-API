import { useState } from "react";
import { createMember, getAdminDashboard, loginWithFirebase } from "./api";
import "./App.css";

interface MemberFormState {
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

const initialMemberFormState: MemberFormState = {
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

function App() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [idToken, setIdToken] = useState("");
  const [authMessage, setAuthMessage] = useState("Not logged in");
  const [responseOutput, setResponseOutput] = useState("");
  const [memberFormState, setMemberFormState] = useState<MemberFormState>(
    initialMemberFormState,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setAuthMessage("Logging in...");

    try {
      const loginResponse = await loginWithFirebase({
        email: loginEmail,
        password: loginPassword,
      });

      setIdToken(loginResponse.idToken);
      setAuthMessage(`Logged in as ${loginResponse.email}`);
      setResponseOutput(JSON.stringify(loginResponse, null, 2));
    } catch (error) {
      setAuthMessage(
        error instanceof Error ? error.message : "Login failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminDashboardRequest = async () => {
    if (!idToken) {
      setResponseOutput("No token available. Please log in first.");
      return;
    }

    setIsLoading(true);

    try {
      const adminDashboardResponse = await getAdminDashboard(idToken);
      setResponseOutput(JSON.stringify(adminDashboardResponse, null, 2));
    } catch (error) {
      setResponseOutput(
        JSON.stringify(
          {
            message:
              error instanceof Error
                ? error.message
                : "Admin dashboard request failed",
          },
          null,
          2,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMember = async () => {
    setIsLoading(true);

    try {
      const createMemberResponse = await createMember(memberFormState);
      setResponseOutput(JSON.stringify(createMemberResponse, null, 2));
    } catch (error) {
      setResponseOutput(
        JSON.stringify(
          {
            message:
              error instanceof Error
                ? error.message
                : "Create member request failed",
          },
          null,
          2,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateMemberFormState = (
    fieldName: keyof MemberFormState,
    fieldValue: string,
  ) => {
    setMemberFormState((currentState) => ({
      ...currentState,
      [fieldName]: fieldValue,
    }));
  };

  return (
    <div className="page">
      <div className="container">
        <header className="section">
          <h1>Gym Membership API Demo</h1>
          <p>
            This frontend demonstrates Firebase login, admin authorization,
            and member creation.
          </p>
        </header>

        <section className="section">
          <h2>Login</h2>
          <div className="formGrid">
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
                onChange={(event) => setLoginPassword(event.target.value)}
                placeholder="Enter password"
              />
            </label>
          </div>

          <button onClick={handleLogin} disabled={isLoading}>
            Log In
          </button>

          <p>
            <strong>Status:</strong> {authMessage}
          </p>
          <p>
            <strong>Token loaded:</strong> {idToken ? "Yes" : "No"}
          </p>
        </section>

        <section className="section">
          <h2>Admin Dashboard</h2>
          <p>
            Use this button after login to test the admin-only endpoint.
          </p>
          <button onClick={handleAdminDashboardRequest} disabled={isLoading}>
            Call Admin Dashboard
          </button>
        </section>

        <section className="section">
          <h2>Create Member</h2>

          <div className="formGrid">
            <label>
              First Name
              <input
                value={memberFormState.firstName}
                onChange={(event) =>
                  updateMemberFormState("firstName", event.target.value)
                }
              />
            </label>

            <label>
              Last Name
              <input
                value={memberFormState.lastName}
                onChange={(event) =>
                  updateMemberFormState("lastName", event.target.value)
                }
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={memberFormState.email}
                onChange={(event) =>
                  updateMemberFormState("email", event.target.value)
                }
              />
            </label>

            <label>
              Phone Number
              <input
                value={memberFormState.phoneNumber}
                onChange={(event) =>
                  updateMemberFormState("phoneNumber", event.target.value)
                }
              />
            </label>

            <label>
              Date of Birth
              <input
                value={memberFormState.dateOfBirth}
                onChange={(event) =>
                  updateMemberFormState("dateOfBirth", event.target.value)
                }
              />
            </label>

            <label>
              Emergency Contact Name
              <input
                value={memberFormState.emergencyContactName}
                onChange={(event) =>
                  updateMemberFormState(
                    "emergencyContactName",
                    event.target.value,
                  )
                }
              />
            </label>

            <label>
              Emergency Contact Phone Number
              <input
                value={memberFormState.emergencyContactPhoneNumber}
                onChange={(event) =>
                  updateMemberFormState(
                    "emergencyContactPhoneNumber",
                    event.target.value,
                  )
                }
              />
            </label>

            <label>
              Membership Status
              <select
                value={memberFormState.membershipStatus}
                onChange={(event) =>
                  updateMemberFormState(
                    "membershipStatus",
                    event.target.value as MemberFormState["membershipStatus"],
                  )
                }
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
                <option value="suspended">suspended</option>
              </select>
            </label>

            <label>
              Join Date
              <input
                value={memberFormState.joinDate}
                onChange={(event) =>
                  updateMemberFormState("joinDate", event.target.value)
                }
              />
            </label>
          </div>

          <button onClick={handleCreateMember} disabled={isLoading}>
            Create Member
          </button>
        </section>

        <section className="section">
          <h2>Response Output</h2>
          <pre>{responseOutput || "No response yet."}</pre>
        </section>
      </div>
    </div>
  );
}

export default App;