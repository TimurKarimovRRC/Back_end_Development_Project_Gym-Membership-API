import {
  type ErrorRequestHandler,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { HTTP_STATUS } from "../../../constants/httpStatus";
import AppError from "../errors/AppError";

const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  next(new AppError(`Route ${req.originalUrl} not found`, HTTP_STATUS.NOT_FOUND));
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      details: error.details ?? [],
    });
    return;
  }

  const unexpectedErrorMessage =
    error instanceof Error ? error.message : "Unknown error";

  console.error("Unhandled error:", unexpectedErrorMessage);

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
    details: [],
  });
};

export { errorHandler, notFoundHandler };