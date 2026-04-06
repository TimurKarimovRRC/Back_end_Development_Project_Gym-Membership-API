import { type Request, type Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpStatus";
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
): Promise<void> => {
  const validationResult = createSubscriptionSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Subscription validation failed",
      errors: validationResult.error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const createdSubscription = await subscriptionService.createSubscription(
      validationResult.value,
    );

    res.status(HTTP_STATUS.CREATED).json(createdSubscription);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Failed to create subscription",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getAllSubscriptions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const subscriptions = await subscriptionService.getAllSubscriptions();

    res.status(HTTP_STATUS.OK).json(subscriptions);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Failed to get subscriptions",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getSubscriptionById = async (
  req: Request<SubscriptionIdParams>,
  res: Response,
): Promise<void> => {
  const validationResult = subscriptionIdSchema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Subscription id validation failed",
      errors: validationResult.error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const subscription = await subscriptionService.getSubscriptionById(
      req.params.subscriptionId,
    );

    if (!subscription) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Subscription not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json(subscription);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Failed to get subscription",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const updateSubscription = async (
  req: Request<SubscriptionIdParams>,
  res: Response,
): Promise<void> => {
  const subscriptionIdValidationResult = subscriptionIdSchema.validate(
    req.params,
    {
      abortEarly: false,
      stripUnknown: true,
    },
  );

  if (subscriptionIdValidationResult.error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Subscription id validation failed",
      errors: subscriptionIdValidationResult.error.details.map(
        (detail) => detail.message,
      ),
    });
    return;
  }

  const updateValidationResult = updateSubscriptionSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (updateValidationResult.error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Subscription update validation failed",
      errors: updateValidationResult.error.details.map(
        (detail) => detail.message,
      ),
    });
    return;
  }

  try {
    const updatedSubscription = await subscriptionService.updateSubscription(
      req.params.subscriptionId,
      updateValidationResult.value,
    );

    if (!updatedSubscription) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Subscription not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json(updatedSubscription);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update subscription",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const deleteSubscription = async (
  req: Request<SubscriptionIdParams>,
  res: Response,
): Promise<void> => {
  const validationResult = subscriptionIdSchema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Subscription id validation failed",
      errors: validationResult.error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const subscriptionWasDeleted =
      await subscriptionService.deleteSubscription(req.params.subscriptionId);

    if (!subscriptionWasDeleted) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Subscription not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Failed to delete subscription",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const subscriptionController = {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
};