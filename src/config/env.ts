const portFromEnvironment: number = Number(process.env.PORT) || 3000;
const nodeEnvironment: string = process.env.NODE_ENV || "development";
const clientOrigin: string = process.env.CLIENT_ORIGIN || "http://localhost:3000";

const firebaseProjectId: string = process.env.FIREBASE_PROJECT_ID || "";
const firebasePrivateKey: string = process.env.FIREBASE_PRIVATE_KEY || "";
const firebaseClientEmail: string = process.env.FIREBASE_CLIENT_EMAIL || "";

export const environmentConfiguration = {
  port: portFromEnvironment,
  nodeEnvironment,
  clientOrigin,
  firebaseProjectId,
  firebasePrivateKey,
  firebaseClientEmail,
};