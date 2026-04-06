import cors, { type CorsOptions } from "cors";
import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";

const app: Express = express();

const corsOptions: CorsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_request: Request, response: Response) => {
  response.status(200).json({
    message: "Gym Membership API is running by Timur Karimov",
  });
});

app.use((_request: Request, response: Response) => {
  response.status(404).json({
    message: "Route not found",
  });
});

export { app };