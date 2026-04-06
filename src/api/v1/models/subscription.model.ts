import Joi from "joi";

export const createSubscriptionSchema = Joi.object({
  memberId: Joi.string().trim().required(),
  planName: Joi.string().trim().min(2).max(100).required(),
  startDate: Joi.string().trim().isoDate().required(),
  endDate: Joi.string().trim().isoDate().required(),
  price: Joi.number().positive().precision(2).required(),
  isActive: Joi.boolean().required(),
  paymentStatus: Joi.string().valid("paid", "unpaid", "overdue").required(),
});

export const updateSubscriptionSchema = Joi.object({
  memberId: Joi.string().trim(),
  planName: Joi.string().trim().min(2).max(100),
  startDate: Joi.string().trim().isoDate(),
  endDate: Joi.string().trim().isoDate(),
  price: Joi.number().positive().precision(2),
  isActive: Joi.boolean(),
  paymentStatus: Joi.string().valid("paid", "unpaid", "overdue"),
})
  .min(1)
  .required();

export const subscriptionIdSchema = Joi.object({
  subscriptionId: Joi.string().trim().required(),
});