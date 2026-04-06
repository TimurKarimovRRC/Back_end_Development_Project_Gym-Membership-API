import { getFirestoreDatabase } from "../../../config/firebase";
import {
  type CreateVisitInput,
  type UpdateVisitInput,
  type Visit,
} from "../types/visit.types";

const visitsCollectionName = "visits";

const createVisit = async (
  createVisitInput: CreateVisitInput,
): Promise<Visit> => {
  const firestoreDatabase = getFirestoreDatabase();
  const visitDocumentReference = firestoreDatabase
    .collection(visitsCollectionName)
    .doc();

  const currentTimestamp = new Date().toISOString();

  const visit: Visit = {
    id: visitDocumentReference.id,
    ...createVisitInput,
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
  };

  await visitDocumentReference.set(visit);

  return visit;
};

const getAllVisits = async (): Promise<Visit[]> => {
  const firestoreDatabase = getFirestoreDatabase();
  const visitsSnapshot = await firestoreDatabase
    .collection(visitsCollectionName)
    .get();

  return visitsSnapshot.docs.map((document) => document.data() as Visit);
};

const getVisitById = async (visitId: string): Promise<Visit | null> => {
  const firestoreDatabase = getFirestoreDatabase();
  const visitDocumentSnapshot = await firestoreDatabase
    .collection(visitsCollectionName)
    .doc(visitId)
    .get();

  if (!visitDocumentSnapshot.exists) {
    return null;
  }

  return visitDocumentSnapshot.data() as Visit;
};

const updateVisit = async (
  visitId: string,
  updateVisitInput: UpdateVisitInput,
): Promise<Visit | null> => {
  const firestoreDatabase = getFirestoreDatabase();
  const visitDocumentReference = firestoreDatabase
    .collection(visitsCollectionName)
    .doc(visitId);

  const existingVisitDocumentSnapshot = await visitDocumentReference.get();

  if (!existingVisitDocumentSnapshot.exists) {
    return null;
  }

  await visitDocumentReference.update({
    ...updateVisitInput,
    updatedAt: new Date().toISOString(),
  });

  const updatedVisitDocumentSnapshot = await visitDocumentReference.get();

  return updatedVisitDocumentSnapshot.data() as Visit;
};

const deleteVisit = async (visitId: string): Promise<boolean> => {
  const firestoreDatabase = getFirestoreDatabase();
  const visitDocumentReference = firestoreDatabase
    .collection(visitsCollectionName)
    .doc(visitId);

  const existingVisitDocumentSnapshot = await visitDocumentReference.get();

  if (!existingVisitDocumentSnapshot.exists) {
    return false;
  }

  await visitDocumentReference.delete();

  return true;
};

export const visitRepository = {
  createVisit,
  getAllVisits,
  getVisitById,
  updateVisit,
  deleteVisit,
};