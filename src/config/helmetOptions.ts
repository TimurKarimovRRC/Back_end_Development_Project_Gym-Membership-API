import helmet, { HelmetOptions } from "helmet";
import { env } from "./env";

export const getHelmetConfiguration = (): HelmetOptions => {
  const isProduction = env.nodeEnvironment === "production";

  return {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    noSniff: true,
    referrerPolicy: { policy: "no-referrer" },
    hsts: isProduction
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false,
  };
};

export const helmetMiddleware = helmet(getHelmetConfiguration());