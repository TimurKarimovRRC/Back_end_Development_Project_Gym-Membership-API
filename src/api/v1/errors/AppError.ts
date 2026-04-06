import { HTTP_STATUS } from "../../../constants/httpStatus";

class AppError extends Error {
  public statusCode: number;
  public details?: string[];
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    details?: string[],
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this);
  }
}

export default AppError;