import { type NextFunction, type Request, type Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpStatus";
import AppError from "../errors/AppError";

interface AuthenticatedUser {
  uid: string;
  email?: string;
  role: string;
}

const authorize = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authenticatedUser = res.locals.authUser as AuthenticatedUser | undefined;

    if (!authenticatedUser) {
      next(
        new AppError(
          "Authenticated user information is missing",
          HTTP_STATUS.UNAUTHORIZED,
        ),
      );
      return;
    }

    if (authenticatedUser.role !== requiredRole) {
      next(new AppError("Forbidden", HTTP_STATUS.FORBIDDEN));
      return;
    }

    next();
  };
};

export default authorize;