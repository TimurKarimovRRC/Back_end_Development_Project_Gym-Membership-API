import { createEmailTransporter } from "../../../config/email";
import { env } from "../../../config/env";

interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const isEmailConfigurationAvailable = (): boolean => {
  return Boolean(
    env.emailHost &&
      env.emailPort &&
      env.emailUser &&
      env.emailPassword &&
      env.emailFrom,
  );
};

const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: SendEmailInput): Promise<void> => {
  const emailTransporter = createEmailTransporter();

  await emailTransporter.sendMail({
    from: env.emailFrom,
    to,
    subject,
    text,
    html,
  });
};

const sendWelcomeEmail = async (
  recipientEmailAddress: string,
  memberFirstName: string,
): Promise<void> => {
  await sendEmail({
    to: recipientEmailAddress,
    subject: "Welcome to the Gym Membership API",
    text: `Hello ${memberFirstName}, welcome to our gym.`,
    html: `<p>Hello ${memberFirstName}, welcome to our gym.</p>`,
  });
};

const sendSubscriptionReminderEmail = async (
  recipientEmailAddress: string,
  memberFirstName: string,
  subscriptionEndDate: string,
): Promise<void> => {
  await sendEmail({
    to: recipientEmailAddress,
    subject: "Subscription Reminder",
    text: `Hello ${memberFirstName}, your subscription is ending on ${subscriptionEndDate}.`,
    html: `<p>Hello ${memberFirstName}, your subscription is ending on <strong>${subscriptionEndDate}</strong>.</p>`,
  });
};

export const emailService = {
  isEmailConfigurationAvailable,
  sendEmail,
  sendWelcomeEmail,
  sendSubscriptionReminderEmail,
};