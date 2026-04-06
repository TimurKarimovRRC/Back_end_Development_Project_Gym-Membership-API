import { type NextFunction, type Request, type Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpStatus";
import AppError from "../errors/AppError";
import {
  createVisitSchema,
  updateVisitSchema,
  visitIdSchema,
} from "../models/visit.model";
import { visitService } from "../services/visit.service";

type VisitIdParams = {
  visitId: string;
};

const createVisit = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const validationResult = createVisitSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    next(
      new AppError(
        "Visit validation failed",
        HTTP_STATUS.BAD_REQUEST,
        validationResult.error.details.map((detail) => detail.message),
      ),
    );
    return;
  }

  try {
    const createdVisit = await visitService.createVisit(validationResult.value);

    res.status(HTTP_STATUS.CREATED).json(createdVisit);
  } catch (error) {
    next(error);
  }
};

const getAllVisits = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const visits = await visitService.getAllVisits();

    res.status(HTTP_STATUS.OK).json(visits);
  } catch (error) {
    next(error);
  }
};

const getVisitById = async (
  req: Request<VisitIdParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const validationResult = visitIdSchema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    next(
      new AppError(
        "Visit id validation failed",
        HTTP_STATUS.BAD_REQUEST,
        validationResult.error.details.map((detail) => detail.message),
      ),
    );
    return;
  }

  try {
    const visit = await visitService.getVisitById(req.params.visitId);

    if (!visit) {
      next(new AppError("Visit not found", HTTP_STATUS.NOT_FOUND));
      return;
    }

    res.status(HTTP_STATUS.OK).json(visit);
  } catch (error) {
    next(error);
  }
};

const updateVisit = async (
  req: Request<VisitIdParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const visitIdValidationResult = visitIdSchema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (visitIdValidationResult.error) {
    next(
      new AppError(
        "Visit id validation failed",
        HTTP_STATUS.BAD_REQUEST,
        visitIdValidationResult.error.details.map((detail) => detail.message),
      ),
    );
    return;
  }

  const updateValidationResult = updateVisitSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (updateValidationResult.error) {
    next(
      new AppError(
        "Visit update validation failed",
        HTTP_STATUS.BAD_REQUEST,
        updateValidationResult.error.details.map((detail) => detail.message),
      ),
    );
    return;
  }

  try {
    const updatedVisit = await visitService.updateVisit(
      req.params.visitId,
      updateValidationResult.value,
    );

    if (!updatedVisit) {
      next(new AppError("Visit not found", HTTP_STATUS.NOT_FOUND));
      return;
    }

    res.status(HTTP_STATUS.OK).json(updatedVisit);
  } catch (error) {
    next(error);
  }
};

const deleteVisit = async (
  req: Request<VisitIdParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const validationResult = visitIdSchema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    next(
      new AppError(
        "Visit id validation failed",
        HTTP_STATUS.BAD_REQUEST,
        validationResult.error.details.map((detail) => detail.message),
      ),
    );
    return;
  }

  try {
    const visitWasDeleted = await visitService.deleteVisit(req.params.visitId);

    if (!visitWasDeleted) {
      next(new AppError("Visit not found", HTTP_STATUS.NOT_FOUND));
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: "Visit deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const visitController = {
  createVisit,
  getAllVisits,
  getVisitById,
  updateVisit,
  deleteVisit,
};