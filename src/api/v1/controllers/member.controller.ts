import { type Request, type Response } from "express";
import {
  createMemberSchema,
  memberIdSchema,
  updateMemberSchema,
} from "../models/member.model";
import { memberService } from "../services/member.service";
import { HTTP_STATUS } from "../../../constants/httpStatus";

const createMember = async (req: Request, res: Response): Promise<void> => {
  const validationResult = createMemberSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Member validation failed",
      errors: validationResult.error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const createdMember = await memberService.createMember(validationResult.value);

    res.status(HTTP_STATUS.CREATED).json(createdMember);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Failed to create member",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getAllMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const members = await memberService.getAllMembers();

    res.status(HTTP_STATUS.OK).json(members);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Failed to get members",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getMemberById = async (req: Request, res: Response): Promise<void> => {
  const validationResult = memberIdSchema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Member id validation failed",
      errors: validationResult.error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const member = await memberService.getMemberById(req.params.memberId);

    if (!member) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Member not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json(member);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Failed to get member",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const updateMember = async (req: Request, res: Response): Promise<void> => {
  const memberIdValidationResult = memberIdSchema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (memberIdValidationResult.error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Member id validation failed",
      errors: memberIdValidationResult.error.details.map(
        (detail) => detail.message,
      ),
    });
    return;
  }

  const memberUpdateValidationResult = updateMemberSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (memberUpdateValidationResult.error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Member update validation failed",
      errors: memberUpdateValidationResult.error.details.map(
        (detail) => detail.message,
      ),
    });
    return;
  }

  try {
    const updatedMember = await memberService.updateMember(
      req.params.memberId,
      memberUpdateValidationResult.value,
    );

    if (!updatedMember) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Member not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json(updatedMember);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update member",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const deleteMember = async (req: Request, res: Response): Promise<void> => {
  const validationResult = memberIdSchema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Member id validation failed",
      errors: validationResult.error.details.map((detail) => detail.message),
    });
    return;
  }

  try {
    const memberWasDeleted = await memberService.deleteMember(req.params.memberId);

    if (!memberWasDeleted) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Member not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: "Member deleted successfully",
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Failed to delete member",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const memberController = {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
};