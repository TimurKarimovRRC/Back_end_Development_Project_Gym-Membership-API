import Joi from "joi";

export const createMemberSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(100).required(),
  lastName: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().required(),
  phoneNumber: Joi.string().trim().min(7).max(20).required(),
  dateOfBirth: Joi.string().trim().isoDate().required(),
  emergencyContactName: Joi.string().trim().min(2).max(100).required(),
  emergencyContactPhoneNumber: Joi.string().trim().min(7).max(20).required(),
  membershipStatus: Joi.string()
    .valid("active", "inactive", "suspended")
    .required(),
  joinDate: Joi.string().trim().isoDate().required(),
});

export const updateMemberSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(100),
  lastName: Joi.string().trim().min(2).max(100),
  email: Joi.string().trim().email(),
  phoneNumber: Joi.string().trim().min(7).max(20),
  dateOfBirth: Joi.string().trim().isoDate(),
  emergencyContactName: Joi.string().trim().min(2).max(100),
  emergencyContactPhoneNumber: Joi.string().trim().min(7).max(20),
  membershipStatus: Joi.string().valid("active", "inactive", "suspended"),
  joinDate: Joi.string().trim().isoDate(),
})
  .min(1)
  .required();

export const memberIdSchema = Joi.object({
  memberId: Joi.string().trim().required(),
});