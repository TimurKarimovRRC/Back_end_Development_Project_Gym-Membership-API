import { CorsOptions } from "cors";
import { env } from "./env";

export const getCorsOptions = (): CorsOptions => {
  const isDevelopment = env.nodeEnvironment === "development";

  if (isDevelopment) {
    return {
      origin: true,
      credentials: false,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      optionsSuccessStatus: 204,
    };
  }

  return {
    origin: env.corsAllowedOrigins,
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  };
};