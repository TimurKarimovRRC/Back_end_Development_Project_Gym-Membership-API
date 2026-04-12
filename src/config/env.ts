import dotenv from "dotenv";

dotenv.config();

const requiredEnvironmentVariableNames = [
  "PORT",
  "NODE_ENV",
] as const;

for (const environmentVariableName of requiredEnvironmentVariableNames) {
  if (!process.env[environmentVariableName]) {
    throw new Error(
      `Missing required environment variable: ${environmentVariableName}`,
    );
  }
}

export const env = {
  port: Number(process.env.PORT),
  nodeEnvironment: process.env.NODE_ENV ?? "development",
  corsAllowedOrigins: (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  firebaseProjectId: process.env.FIREBASE_PROJECT_ID ?? "",
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? "",
  firebasePrivateKey: (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(
    /\\n/g,
    "\n",
  ),

  emailHost: process.env.EMAIL_HOST ?? "",
  emailPort: Number(process.env.EMAIL_PORT ?? 0),
  emailUser: process.env.EMAIL_USER ?? "",
  emailPassword: process.env.EMAIL_PASSWORD ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "",
};