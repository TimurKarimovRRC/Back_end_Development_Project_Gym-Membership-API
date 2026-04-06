import { visitRepository } from "../repositories/visit.repository";
import {
  type CreateVisitInput,
  type UpdateVisitInput,
  type Visit,
} from "../types/visit.types";

const createVisit = async (
  createVisitInput: CreateVisitInput,
): Promise<Visit> => {
  return visitRepository.createVisit(createVisitInput);
};

const getAllVisits = async (): Promise<Visit[]> => {
  return visitRepository.getAllVisits();
};

const getVisitById = async (visitId: string): Promise<Visit | null> => {
  return visitRepository.getVisitById(visitId);
};

const updateVisit = async (
  visitId: string,
  updateVisitInput: UpdateVisitInput,
): Promise<Visit | null> => {
  return visitRepository.updateVisit(visitId, updateVisitInput);
};

const deleteVisit = async (visitId: string): Promise<boolean> => {
  return visitRepository.deleteVisit(visitId);
};

export const visitService = {
  createVisit,
  getAllVisits,
  getVisitById,
  updateVisit,
  deleteVisit,
};