import { emailService } from "./email.service";
import { memberRepository } from "../repositories/member.repository";
import { subscriptionRepository } from "../repositories/subscription.repository";
import {
  type CreateSubscriptionInput,
  type Subscription,
  type UpdateSubscriptionInput,
} from "../types/subscription.types";

const subscriptionReminderWindowInDays = 7;

const isSubscriptionEndingSoon = (
  subscriptionEndDate: string,
  reminderWindowInDays: number = subscriptionReminderWindowInDays,
): boolean => {
  const currentDate = new Date();
  const endDate = new Date(subscriptionEndDate);

  const millisecondsUntilEndDate = endDate.getTime() - currentDate.getTime();
  const daysUntilEndDate = millisecondsUntilEndDate / (1000 * 60 * 60 * 24);

  return daysUntilEndDate >= 0 && daysUntilEndDate <= reminderWindowInDays;
};

const tryToSendSubscriptionReminderEmail = async (
  subscription: Subscription,
): Promise<void> => {
  if (!emailService.isEmailConfigurationAvailable()) {
    return;
  }

  if (!subscription.isActive) {
    return;
  }

  if (!isSubscriptionEndingSoon(subscription.endDate)) {
    return;
  }

  const member = await memberRepository.getMemberById(subscription.memberId);

  if (!member) {
    return;
  }

  await emailService.sendSubscriptionReminderEmail(
    member.email,
    member.firstName,
    subscription.endDate,
  );
};

const createSubscription = async (
  createSubscriptionInput: CreateSubscriptionInput,
): Promise<Subscription> => {
  const createdSubscription = await subscriptionRepository.createSubscription(
    createSubscriptionInput,
  );

  try {
    await tryToSendSubscriptionReminderEmail(createdSubscription);
  } catch (error) {
    console.error("Failed to send subscription reminder email:", error);
  }

  return createdSubscription;
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
  const updatedSubscription = await subscriptionRepository.updateSubscription(
    subscriptionId,
    updateSubscriptionInput,
  );

  if (!updatedSubscription) {
    return null;
  }

  try {
    await tryToSendSubscriptionReminderEmail(updatedSubscription);
  } catch (error) {
    console.error("Failed to send subscription reminder email:", error);
  }

  return updatedSubscription;
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