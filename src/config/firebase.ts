import admin, { type ServiceAccount } from "firebase-admin";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { env } from "./env";

let firestoreDatabase: Firestore | null = null;

const validateFirebaseEnvironmentVariables = (): void => {
  const missingEnvironmentVariables: string[] = [];

  if (!env.firebaseProjectId) {
    missingEnvironmentVariables.push("FIREBASE_PROJECT_ID");
  }

  if (!env.firebaseClientEmail) {
    missingEnvironmentVariables.push("FIREBASE_CLIENT_EMAIL");
  }

  if (!env.firebasePrivateKey) {
    missingEnvironmentVariables.push("FIREBASE_PRIVATE_KEY");
  }

  if (missingEnvironmentVariables.length > 0) {
    throw new Error(
      `Missing Firebase environment variables: ${missingEnvironmentVariables.join(", ")}`,
    );
  }
};

const initializeFirebaseApp = (): admin.app.App => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  validateFirebaseEnvironmentVariables();

  const firebaseServiceAccount: ServiceAccount = {
    projectId: env.firebaseProjectId,
    clientEmail: env.firebaseClientEmail,
    privateKey: env.firebasePrivateKey,
  };

  return admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount),
  });
};

export const getFirestoreDatabase = (): Firestore => {
  if (firestoreDatabase) {
    return firestoreDatabase;
  }

  const firebaseApp = initializeFirebaseApp();
  firestoreDatabase = getFirestore(firebaseApp);

  return firestoreDatabase;
};

export const getFirebaseAuth = (): admin.auth.Auth => {
  const firebaseApp = initializeFirebaseApp();
  return firebaseApp.auth();
};