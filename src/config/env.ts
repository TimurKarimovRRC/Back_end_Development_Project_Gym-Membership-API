const portFromEnvironment: number = Number(process.env.PORT) || 3000;
const nodeEnvironment: string = process.env.NODE_ENV || "development";
const clientOrigin: string = process.env.CLIENT_ORIGIN || "http://localhost:3000";

export const environmentConfiguration = {
  port: portFromEnvironment,
  nodeEnvironment,
  clientOrigin,
};