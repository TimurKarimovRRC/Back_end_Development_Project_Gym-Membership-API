import { type Request, type Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpStatus";
import {
  createVisitSchema,
  updateVisitSchema,
  visitIdSchema,
} from "../models/visit.model";
import { visitService } from "../services/visit.service";

type VisitIdParams = {
  visitId: string;
};

const createVisit = async (req: Request, res: Response): Promise<void> => {
  const validationResult = createVisitSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Visit validation failed",
      errors: validationResult.error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const createdVisit = await visitService.createVisit(validationResult.value);

    res.status(HTTP_STATUS.CREATED).json(createdVisit);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Failed to create visit",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getAllVisits = async (req: Request, res: Response): Promise<void> => {
  try {
    const visits = await visitService.getAllVisits();

    res.status(HTTP_STATUS.OK).json(visits);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Failed to get visits",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getVisitById = async (
  req: Request<VisitIdParams>,
  res: Response,
): Promise<void> => {
  const validationResult = visitIdSchema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Visit id validation failed",
      errors: validationResult.error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const visit = await visitService.getVisitById(req.params.visitId);

    if (!visit) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Visit not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json(visit);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Failed to get visit",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const updateVisit = async (
  req: Request<VisitIdParams>,
  res: Response,
): Promise<void> => {
  const visitIdValidationResult = visitIdSchema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (visitIdValidationResult.error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Visit id validation failed",
      errors: visitIdValidationResult.error.details.map(
        (detail) => detail.message,
      ),
    });
    return;
  }

  const updateValidationResult = updateVisitSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (updateValidationResult.error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Visit update validation failed",
      errors: updateValidationResult.error.details.map(
        (detail) => detail.message,
      ),
    });
    return;
  }

  try {
    const updatedVisit = await visitService.updateVisit(
      req.params.visitId,
      updateValidationResult.value,
    );

    if (!updatedVisit) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Visit not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json(updatedVisit);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update visit",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const deleteVisit = async (
  req: Request<VisitIdParams>,
  res: Response,
): Promise<void> => {
  const validationResult = visitIdSchema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Visit id validation failed",
      errors: validationResult.error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const visitWasDeleted = await visitService.deleteVisit(req.params.visitId);

    if (!visitWasDeleted) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Visit not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: "Visit deleted successfully",
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Failed to delete visit",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const visitController = {
  createVisit,
  getAllVisits,
  getVisitById,
  updateVisit,
  deleteVisit,
};