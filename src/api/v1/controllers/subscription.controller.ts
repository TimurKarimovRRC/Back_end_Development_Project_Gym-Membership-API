import { type NextFunction, type Request, type Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpStatus";
import AppError from "../errors/AppError";
import {
  createSubscriptionSchema,
  subscriptionIdSchema,
  updateSubscriptionSchema,
} from "../models/subscription.model";
import { subscriptionService } from "../services/subscription.service";

type SubscriptionIdParams = {
  subscriptionId: string;
};

const createSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const validationResult = createSubscriptionSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    next(
      new AppError(
        "Subscription validation failed",
        HTTP_STATUS.BAD_REQUEST,
        validationResult.error.details.map((detail) => detail.message),
      ),
    );
    return;
  }

  try {
    const createdSubscription = await subscriptionService.createSubscription(
      validationResult.value,
    );

    res.status(HTTP_STATUS.CREATED).json(createdSubscription);
  } catch (error) {
    next(error);
  }
};

const getAllSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const subscriptions = await subscriptionService.getAllSubscriptions();

    res.status(HTTP_STATUS.OK).json(subscriptions);
  } catch (error) {
    next(error);
  }
};

const getSubscriptionById = async (
  req: Request<SubscriptionIdParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const validationResult = subscriptionIdSchema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    next(
      new AppError(
        "Subscription id validation failed",
        HTTP_STATUS.BAD_REQUEST,
        validationResult.error.details.map((detail) => detail.message),
      ),
    );
    return;
  }

  try {
    const subscription = await subscriptionService.getSubscriptionById(
      req.params.subscriptionId,
    );

    if (!subscription) {
      next(new AppError("Subscription not found", HTTP_STATUS.NOT_FOUND));
      return;
    }

    res.status(HTTP_STATUS.OK).json(subscription);
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (
  req: Request<SubscriptionIdParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const subscriptionIdValidationResult = subscriptionIdSchema.validate(
    req.params,
    {
      abortEarly: false,
      stripUnknown: true,
    },
  );

  if (subscriptionIdValidationResult.error) {
    next(
      new AppError(
        "Subscription id validation failed",
        HTTP_STATUS.BAD_REQUEST,
        subscriptionIdValidationResult.error.details.map(
          (detail) => detail.message,
        ),
      ),
    );
    return;
  }

  const updateValidationResult = updateSubscriptionSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (updateValidationResult.error) {
    next(
      new AppError(
        "Subscription update validation failed",
        HTTP_STATUS.BAD_REQUEST,
        updateValidationResult.error.details.map((detail) => detail.message),
      ),
    );
    return;
  }

  try {
    const updatedSubscription = await subscriptionService.updateSubscription(
      req.params.subscriptionId,
      updateValidationResult.value,
    );

    if (!updatedSubscription) {
      next(new AppError("Subscription not found", HTTP_STATUS.NOT_FOUND));
      return;
    }

    res.status(HTTP_STATUS.OK).json(updatedSubscription);
  } catch (error) {
    next(error);
  }
};

const deleteSubscription = async (
  req: Request<SubscriptionIdParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const validationResult = subscriptionIdSchema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    next(
      new AppError(
        "Subscription id validation failed",
        HTTP_STATUS.BAD_REQUEST,
        validationResult.error.details.map((detail) => detail.message),
      ),
    );
    return;
  }

  try {
    const subscriptionWasDeleted =
      await subscriptionService.deleteSubscription(req.params.subscriptionId);

    if (!subscriptionWasDeleted) {
      next(new AppError("Subscription not found", HTTP_STATUS.NOT_FOUND));
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const subscriptionController = {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
};