import { subscriptionRepository } from "../repositories/subscription.repository";
import {
  type CreateSubscriptionInput,
  type Subscription,
  type UpdateSubscriptionInput,
} from "../types/subscription.types";

const createSubscription = async (
  createSubscriptionInput: CreateSubscriptionInput,
): Promise<Subscription> => {
  return subscriptionRepository.createSubscription(createSubscriptionInput);
};

const getAllSubscriptions = async (): Promise<Subscription[]> => {
  return subscriptionRepository.getAllSubscriptions();
};

const getSubscriptionById = async (
  subscriptionId: string,
): Promise<Subscription | null> => {
  return subscriptionRepository.getSubscriptionById(subscriptionId);
};

const updateSubscription = async (
  subscriptionId: string,
  updateSubscriptionInput: UpdateSubscriptionInput,
): Promise<Subscription | null> => {
  return subscriptionRepository.updateSubscription(
    subscriptionId,
    updateSubscriptionInput,
  );
};

const deleteSubscription = async (
  subscriptionId: string,
): Promise<boolean> => {
  return subscriptionRepository.deleteSubscription(subscriptionId);
};

export const subscriptionService = {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
};