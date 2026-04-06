import { getFirestoreDatabase } from "../../../config/firebase";
import {
  type CreateMemberInput,
  type Member,
  type UpdateMemberInput,
} from "../types/member.types";

const membersCollectionName = "members";

const createMember = async (
  createMemberInput: CreateMemberInput,
): Promise<Member> => {
  const firestoreDatabase = getFirestoreDatabase();
  const memberDocumentReference = firestoreDatabase
    .collection(membersCollectionName)
    .doc();

  const currentTimestamp = new Date().toISOString();

  const member: Member = {
    id: memberDocumentReference.id,
    ...createMemberInput,
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
  };

  await memberDocumentReference.set(member);

  return member;
};

const getAllMembers = async (): Promise<Member[]> => {
  const firestoreDatabase = getFirestoreDatabase();
  const membersSnapshot = await firestoreDatabase
    .collection(membersCollectionName)
    .get();

  return membersSnapshot.docs.map((document) => document.data() as Member);
};

const getMemberById = async (memberId: string): Promise<Member | null> => {
  const firestoreDatabase = getFirestoreDatabase();
  const memberDocumentSnapshot = await firestoreDatabase
    .collection(membersCollectionName)
    .doc(memberId)
    .get();

  if (!memberDocumentSnapshot.exists) {
    return null;
  }

  return memberDocumentSnapshot.data() as Member;
};

const updateMember = async (
  memberId: string,
  updateMemberInput: UpdateMemberInput,
): Promise<Member | null> => {
  const firestoreDatabase = getFirestoreDatabase();
  const memberDocumentReference = firestoreDatabase
    .collection(membersCollectionName)
    .doc(memberId);

  const existingMemberDocumentSnapshot = await memberDocumentReference.get();

  if (!existingMemberDocumentSnapshot.exists) {
    return null;
  }

  await memberDocumentReference.update({
    ...updateMemberInput,
    updatedAt: new Date().toISOString(),
  });

  const updatedMemberDocumentSnapshot = await memberDocumentReference.get();

  return updatedMemberDocumentSnapshot.data() as Member;
};

const deleteMember = async (memberId: string): Promise<boolean> => {
  const firestoreDatabase = getFirestoreDatabase();
  const memberDocumentReference = firestoreDatabase
    .collection(membersCollectionName)
    .doc(memberId);

  const existingMemberDocumentSnapshot = await memberDocumentReference.get();

  if (!existingMemberDocumentSnapshot.exists) {
    return false;
  }

  await memberDocumentReference.delete();

  return true;
};

export const memberRepository = {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
};