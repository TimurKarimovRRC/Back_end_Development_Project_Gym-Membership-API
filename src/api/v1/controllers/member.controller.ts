import { type NextFunction, type Request, type Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpStatus";
import {
  createMemberSchema,
  memberIdSchema,
  updateMemberSchema,
} from "../models/member.model";
import { memberService } from "../services/member.service";
import AppError from "../errors/AppError";

type MemberIdParams = {
  memberId: string;
};

const createMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const validationResult = createMemberSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    next(
      new AppError(
        "Member validation failed",
        HTTP_STATUS.BAD_REQUEST,
        validationResult.error.details.map((detail) => detail.message),
      ),
    );
    return;
  }

  try {
    const createdMember = await memberService.createMember(validationResult.value);

    res.status(HTTP_STATUS.CREATED).json(createdMember);
  } catch (error) {
    next(error);
  }
};

const getAllMembers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const members = await memberService.getAllMembers();

    res.status(HTTP_STATUS.OK).json(members);
  } catch (error) {
    next(error);
  }
};

const getMemberById = async (
  req: Request<MemberIdParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const validationResult = memberIdSchema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    next(
      new AppError(
        "Member id validation failed",
        HTTP_STATUS.BAD_REQUEST,
        validationResult.error.details.map((detail) => detail.message),
      ),
    );
    return;
  }

  try {
    const member = await memberService.getMemberById(req.params.memberId);

    if (!member) {
      next(new AppError("Member not found", HTTP_STATUS.NOT_FOUND));
      return;
    }

    res.status(HTTP_STATUS.OK).json(member);
  } catch (error) {
    next(error);
  }
};

const updateMember = async (
  req: Request<MemberIdParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const memberIdValidationResult = memberIdSchema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (memberIdValidationResult.error) {
    next(
      new AppError(
        "Member id validation failed",
        HTTP_STATUS.BAD_REQUEST,
        memberIdValidationResult.error.details.map((detail) => detail.message),
      ),
    );
    return;
  }

  const memberUpdateValidationResult = updateMemberSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (memberUpdateValidationResult.error) {
    next(
      new AppError(
        "Member update validation failed",
        HTTP_STATUS.BAD_REQUEST,
        memberUpdateValidationResult.error.details.map(
          (detail) => detail.message,
        ),
      ),
    );
    return;
  }

  try {
    const updatedMember = await memberService.updateMember(
      req.params.memberId,
      memberUpdateValidationResult.value,
    );

    if (!updatedMember) {
      next(new AppError("Member not found", HTTP_STATUS.NOT_FOUND));
      return;
    }

    res.status(HTTP_STATUS.OK).json(updatedMember);
  } catch (error) {
    next(error);
  }
};

const deleteMember = async (
  req: Request<MemberIdParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const validationResult = memberIdSchema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    next(
      new AppError(
        "Member id validation failed",
        HTTP_STATUS.BAD_REQUEST,
        validationResult.error.details.map((detail) => detail.message),
      ),
    );
    return;
  }

  try {
    const memberWasDeleted = await memberService.deleteMember(req.params.memberId);

    if (!memberWasDeleted) {
      next(new AppError("Member not found", HTTP_STATUS.NOT_FOUND));
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: "Member deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const memberController = {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
};