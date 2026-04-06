import Joi from "joi";

export const createVisitSchema = Joi.object({
  memberId: Joi.string().trim().required(),
  visitDate: Joi.string().trim().isoDate().required(),
  checkInTime: Joi.string().trim().required(),
  checkOutTime: Joi.string().trim().optional(),
  notes: Joi.string().trim().max(500).optional(),
});

export const updateVisitSchema = Joi.object({
  memberId: Joi.string().trim(),
  visitDate: Joi.string().trim().isoDate(),
  checkInTime: Joi.string().trim(),
  checkOutTime: Joi.string().trim().allow(""),
  notes: Joi.string().trim().max(500).allow(""),
})
  .min(1)
  .required();

export const visitIdSchema = Joi.object({
  visitId: Joi.string().trim().required(),
});