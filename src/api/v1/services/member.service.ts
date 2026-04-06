import { memberRepository } from "../repositories/member.repository";
import {
  type CreateMemberInput,
  type Member,
  type UpdateMemberInput,
} from "../types/member.types";

const createMember = async (
  createMemberInput: CreateMemberInput,
): Promise<Member> => {
  return memberRepository.createMember(createMemberInput);
};

const getAllMembers = async (): Promise<Member[]> => {
  return memberRepository.getAllMembers();
};

const getMemberById = async (memberId: string): Promise<Member | null> => {
  return memberRepository.getMemberById(memberId);
};

const updateMember = async (
  memberId: string,
  updateMemberInput: UpdateMemberInput,
): Promise<Member | null> => {
  return memberRepository.updateMember(memberId, updateMemberInput);
};

const deleteMember = async (memberId: string): Promise<boolean> => {
  return memberRepository.deleteMember(memberId);
};

export const memberService = {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
};