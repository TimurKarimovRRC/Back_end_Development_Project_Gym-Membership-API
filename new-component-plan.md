# New Component Plan – Nodemailer

## 1. Chosen Component

For my new component, I chose **Nodemailer**.

I selected Nodemailer because it fits my Gym Membership API project well and gives the API a practical feature that could be used in a real gym system. Since the project already manages members and subscriptions, email notifications are a natural addition.

---

## 2. Why I Chose Nodemailer

I chose Nodemailer for three main reasons:

### 1. Good fit for the project
This API already stores member and subscription data. Adding email support makes sense because gyms often need to send:
- welcome emails to new members
- subscription renewal reminders
- payment or status notifications

### 2. Easy backend integration
My project is built with Node.js, TypeScript, and Express, so Nodemailer can be integrated directly into the existing back-end structure without changing the architecture.

### 3. Useful real-world functionality
This component adds something practical instead of just technical complexity. It improves communication between the system and gym members.

---

## 3. Planned Use in This Project

I plan to use Nodemailer for two main features:

### Welcome Email
When a new member is successfully created, the system will send a welcome email.

Example purpose:
- confirm successful registration
- greet the member
- make the API feel more realistic

### Subscription Reminder Email
When a subscription is close to its end date, the system will be able to send a reminder email.

Example purpose:
- remind the member to renew
- reduce expired memberships
- improve member communication

---

## 4. Planned Integration Approach

I will integrate Nodemailer using the layered architecture already used in the project.

### Planned files
- `src/api/v1/services/email.service.ts`
- possible helper or config updates in `src/config/`
- integration into member or subscription services

### Planned flow
1. A member is created or a subscription is checked
2. The service layer decides whether an email should be sent
3. Nodemailer sends the email using a configured transporter
4. The API returns its normal response

This keeps the email logic separate from the controller logic and matches the structure used in the rest of the project.

---

## 5. Environment Variables Needed

To keep credentials secure, email settings should be stored in environment variables instead of hardcoding them.

Planned variables:
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `EMAIL_FROM`

This follows the same secure configuration style already used in the project.

---

## 6. Expected Benefits

Adding Nodemailer should improve the project in several ways:

- makes the API more realistic
- adds useful communication features
- shows integration of an external component
- demonstrates practical back-end development skills
- expands the project beyond basic CRUD

---

## 7. Possible Challenges

Some possible challenges include:

- configuring SMTP correctly
- handling authentication errors
- avoiding hardcoded credentials
- testing email features without sending unnecessary real emails

To reduce risk, I will keep the implementation simple and focus on a small number of useful email actions.

---

## 8. Initial Implementation Plan

### Phase 1
Set up Nodemailer transporter with environment variables.

### Phase 2
Create an email service for reusable email sending logic.

### Phase 3
Send a welcome email after successful member creation.

### Phase 4
Add a subscription reminder email feature.

### Phase 5
Test the feature and document how it works.

---

## 9. Conclusion

Nodemailer is a strong choice for this project because it adds realistic functionality that matches the purpose of the Gym Membership API. It is practical, relevant, and can be integrated cleanly into the existing project structure.