import admin, { type ServiceAccount } from "firebase-admin";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { environmentConfiguration } from "./env";

let firestoreDatabaseInstance: Firestore | null = null;

const validateFirebaseEnvironmentVariables = (): void => {
  const missingEnvironmentVariables: string[] = [];

  if (!environmentConfiguration.firebaseProjectId) {
    missingEnvironmentVariables.push("FIREBASE_PROJECT_ID");
  }

  if (!environmentConfiguration.firebasePrivateKey) {
    missingEnvironmentVariables.push("FIREBASE_PRIVATE_KEY");
  }

  if (!environmentConfiguration.firebaseClientEmail) {
    missingEnvironmentVariables.push("FIREBASE_CLIENT_EMAIL");
  }

  if (missingEnvironmentVariables.length > 0) {
    throw new Error(
      `Missing Firebase environment variables: ${missingEnvironmentVariables.join(", ")}`,
    );
  }
};

const createFirebaseServiceAccount = (): ServiceAccount => {
  validateFirebaseEnvironmentVariables();

  return {
    projectId: environmentConfiguration.firebaseProjectId,
    privateKey: environmentConfiguration.firebasePrivateKey.replace(/\\n/g, "\n"),
    clientEmail: environmentConfiguration.firebaseClientEmail,
  };
};

const initializeFirebaseAdmin = (): admin.app.App => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const firebaseServiceAccount: ServiceAccount = createFirebaseServiceAccount();

  return admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount),
  });
};

export const getFirestoreDatabase = (): Firestore => {
  if (firestoreDatabaseInstance) {
    return firestoreDatabaseInstance;
  }

  const firebaseApplication: admin.app.App = initializeFirebaseAdmin();
  firestoreDatabaseInstance = getFirestore(firebaseApplication);

  return firestoreDatabaseInstance;
};

export const getFirebaseAdminApplication = (): admin.app.App => {
  return initializeFirebaseAdmin();
};

export const getFirebaseAuth = (): admin.auth.Auth => {
  const firebaseApplication: admin.app.App = initializeFirebaseAdmin();
  return firebaseApplication.auth();
};