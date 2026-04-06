import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "./swaggerOptions";

export const swaggerSpecification = swaggerJSDoc(swaggerOptions);

const setupSwagger = (app: Express): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecification, {
      customSiteTitle: "Gym Membership API Docs",
      customCss: ".swagger-ui .topbar { display: none }",
    }),
  );
};

export default setupSwagger;