import { getFirestoreDatabase } from "../../../config/firebase";
import {
  type CreateSubscriptionInput,
  type Subscription,
  type UpdateSubscriptionInput,
} from "../types/subscription.types";

const subscriptionsCollectionName = "subscriptions";

const createSubscription = async (
  createSubscriptionInput: CreateSubscriptionInput,
): Promise<Subscription> => {
  const firestoreDatabase = getFirestoreDatabase();
  const subscriptionDocumentReference = firestoreDatabase
    .collection(subscriptionsCollectionName)
    .doc();

  const currentTimestamp = new Date().toISOString();

  const subscription: Subscription = {
    id: subscriptionDocumentReference.id,
    ...createSubscriptionInput,
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
  };

  await subscriptionDocumentReference.set(subscription);

  return subscription;
};

const getAllSubscriptions = async (): Promise<Subscription[]> => {
  const firestoreDatabase = getFirestoreDatabase();
  const subscriptionsSnapshot = await firestoreDatabase
    .collection(subscriptionsCollectionName)
    .get();

  return subscriptionsSnapshot.docs.map(
    (document) => document.data() as Subscription,
  );
};

const getSubscriptionById = async (
  subscriptionId: string,
): Promise<Subscription | null> => {
  const firestoreDatabase = getFirestoreDatabase();
  const subscriptionDocumentSnapshot = await firestoreDatabase
    .collection(subscriptionsCollectionName)
    .doc(subscriptionId)
    .get();

  if (!subscriptionDocumentSnapshot.exists) {
    return null;
  }

  return subscriptionDocumentSnapshot.data() as Subscription;
};

const updateSubscription = async (
  subscriptionId: string,
  updateSubscriptionInput: UpdateSubscriptionInput,
): Promise<Subscription | null> => {
  const firestoreDatabase = getFirestoreDatabase();
  const subscriptionDocumentReference = firestoreDatabase
    .collection(subscriptionsCollectionName)
    .doc(subscriptionId);

  const existingSubscriptionDocumentSnapshot =
    await subscriptionDocumentReference.get();

  if (!existingSubscriptionDocumentSnapshot.exists) {
    return null;
  }

  await subscriptionDocumentReference.update({
    ...updateSubscriptionInput,
    updatedAt: new Date().toISOString(),
  });

  const updatedSubscriptionDocumentSnapshot =
    await subscriptionDocumentReference.get();

  return updatedSubscriptionDocumentSnapshot.data() as Subscription;
};

const deleteSubscription = async (
  subscriptionId: string,
): Promise<boolean> => {
  const firestoreDatabase = getFirestoreDatabase();
  const subscriptionDocumentReference = firestoreDatabase
    .collection(subscriptionsCollectionName)
    .doc(subscriptionId);

  const existingSubscriptionDocumentSnapshot =
    await subscriptionDocumentReference.get();

  if (!existingSubscriptionDocumentSnapshot.exists) {
    return false;
  }

  await subscriptionDocumentReference.delete();

  return true;
};

export const subscriptionRepository = {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
};