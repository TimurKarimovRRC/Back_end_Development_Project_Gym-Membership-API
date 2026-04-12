import nodemailer, { type Transporter } from "nodemailer";
import { env } from "./env";

const validateEmailEnvironmentVariables = (): void => {
  const missingEnvironmentVariables: string[] = [];

  if (!env.emailHost) {
    missingEnvironmentVariables.push("EMAIL_HOST");
  }

  if (!env.emailPort) {
    missingEnvironmentVariables.push("EMAIL_PORT");
  }

  if (!env.emailUser) {
    missingEnvironmentVariables.push("EMAIL_USER");
  }

  if (!env.emailPassword) {
    missingEnvironmentVariables.push("EMAIL_PASSWORD");
  }

  if (!env.emailFrom) {
    missingEnvironmentVariables.push("EMAIL_FROM");
  }

  if (missingEnvironmentVariables.length > 0) {
    throw new Error(
      `Missing email environment variables: ${missingEnvironmentVariables.join(", ")}`,
    );
  }
};

const createEmailTransporter = (): Transporter => {
  validateEmailEnvironmentVariables();

  return nodemailer.createTransport({
    host: env.emailHost,
    port: env.emailPort,
    secure: env.emailPort === 465,
    auth: {
      user: env.emailUser,
      pass: env.emailPassword,
    },
  });
};

export { createEmailTransporter };