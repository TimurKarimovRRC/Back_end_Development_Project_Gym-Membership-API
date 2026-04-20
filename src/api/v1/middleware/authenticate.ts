import {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { getFirebaseAuth } from "../../../config/firebase";
import { HTTP_STATUS } from "../../../constants/httpStatus";
import AppError from "../errors/AppError";

interface AuthenticatedUser {
  uid: string;
  email?: string;
  role: string;
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    next(
      new AppError(
        "Authorization token is missing or invalid",
        HTTP_STATUS.UNAUTHORIZED,
      ),
    );
    return;
  }

  const idToken = authorizationHeader.replace("Bearer ", "").trim();

  try {
    const decodedIdToken = await getFirebaseAuth().verifyIdToken(idToken);

    const authenticatedUser: AuthenticatedUser = {
      uid: decodedIdToken.uid,
      email: decodedIdToken.email,
      role:
        typeof decodedIdToken.role === "string"
          ? decodedIdToken.role
          : "user",
    };

    res.locals.authUser = authenticatedUser;
    next();
  } catch (error) {
    next(
      new AppError(
        "Invalid or expired authentication token",
        HTTP_STATUS.UNAUTHORIZED,
      ),
    );
  }
};

export default authenticate;