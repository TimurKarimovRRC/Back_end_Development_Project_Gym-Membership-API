import express, { type Express, type Request, type Response } from "express";

const app: Express = express();

app.use(express.json());

app.get("/", (_request: Request, response: Response) => {
  response.status(200).json({
    message: "Gym Membership API is running by Timur Karimov",
  });
});

export default app;