// eslint-disable-next-line @typescript-eslint/no-require-imports
const swaggerJSDoc = require("swagger-jsdoc") as (options: object) => object;
import { env } from "./env";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Gym Membership API",
      version: "1.0.0",
      description: "API documentation for the Gym Membership API project",
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: "Local server",
      },
    ],
    components: {
      schemas: {
        HealthResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "ok",
            },
            uptime: {
              type: "number",
              example: 12.345,
            },
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2026-04-06T00:00:00.000Z",
            },
            version: {
              type: "string",
              example: "1.0.0",
            },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Validation failed",
            },
            details: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["\"firstName\" is required"],
            },
          },
        },

        Member: {
          type: "object",
          properties: {
            id: { type: "string", example: "member-123" },
            firstName: { type: "string", example: "Timur" },
            lastName: { type: "string", example: "Karimov" },
            email: { type: "string", example: "timur@example.com" },
            phoneNumber: { type: "string", example: "2045551234" },
            dateOfBirth: {
              type: "string",
              format: "date-time",
              example: "1999-04-16T00:00:00.000Z",
            },
            emergencyContactName: {
              type: "string",
              example: "John Karimov",
            },
            emergencyContactPhoneNumber: {
              type: "string",
              example: "2045559999",
            },
            membershipStatus: {
              type: "string",
              example: "active",
            },
            joinDate: {
              type: "string",
              format: "date-time",
              example: "2026-04-06T00:00:00.000Z",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-04-06T00:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-04-06T00:00:00.000Z",
            },
          },
        },

        CreateMemberInput: {
          type: "object",
          required: [
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "dateOfBirth",
            "emergencyContactName",
            "emergencyContactPhoneNumber",
            "membershipStatus",
            "joinDate",
          ],
          properties: {
            firstName: { type: "string", example: "Timur" },
            lastName: { type: "string", example: "Karimov" },
            email: { type: "string", example: "timur@example.com" },
            phoneNumber: { type: "string", example: "2045551234" },
            dateOfBirth: {
              type: "string",
              format: "date-time",
              example: "1999-04-16T00:00:00.000Z",
            },
            emergencyContactName: {
              type: "string",
              example: "John Karimov",
            },
            emergencyContactPhoneNumber: {
              type: "string",
              example: "2045559999",
            },
            membershipStatus: {
              type: "string",
              enum: ["active", "inactive", "suspended"],
              example: "active",
            },
            joinDate: {
              type: "string",
              format: "date-time",
              example: "2026-04-06T00:00:00.000Z",
            },
          },
        },

        UpdateMemberInput: {
          type: "object",
          properties: {
            firstName: { type: "string", example: "Timur" },
            lastName: { type: "string", example: "Karimov" },
            email: { type: "string", example: "timur@example.com" },
            phoneNumber: { type: "string", example: "2045551234" },
            dateOfBirth: {
              type: "string",
              format: "date-time",
              example: "1999-04-16T00:00:00.000Z",
            },
            emergencyContactName: {
              type: "string",
              example: "John Karimov",
            },
            emergencyContactPhoneNumber: {
              type: "string",
              example: "2045559999",
            },
            membershipStatus: {
              type: "string",
              enum: ["active", "inactive", "suspended"],
              example: "inactive",
            },
            joinDate: {
              type: "string",
              format: "date-time",
              example: "2026-04-06T00:00:00.000Z",
            },
          },
        },

        Subscription: {
          type: "object",
          properties: {
            id: { type: "string", example: "subscription-123" },
            memberId: { type: "string", example: "member-123" },
            planName: { type: "string", example: "Monthly Premium" },
            startDate: {
              type: "string",
              format: "date-time",
              example: "2026-04-06T00:00:00.000Z",
            },
            endDate: {
              type: "string",
              format: "date-time",
              example: "2026-05-06T00:00:00.000Z",
            },
            price: { type: "number", example: 49.99 },
            isActive: { type: "boolean", example: true },
            paymentStatus: {
              type: "string",
              example: "paid",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-04-06T00:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-04-06T00:00:00.000Z",
            },
          },
        },

        CreateSubscriptionInput: {
          type: "object",
          required: [
            "memberId",
            "planName",
            "startDate",
            "endDate",
            "price",
            "isActive",
            "paymentStatus",
          ],
          properties: {
            memberId: { type: "string", example: "member-123" },
            planName: { type: "string", example: "Monthly Premium" },
            startDate: {
              type: "string",
              format: "date-time",
              example: "2026-04-06T00:00:00.000Z",
            },
            endDate: {
              type: "string",
              format: "date-time",
              example: "2026-05-06T00:00:00.000Z",
            },
            price: { type: "number", example: 49.99 },
            isActive: { type: "boolean", example: true },
            paymentStatus: {
              type: "string",
              enum: ["paid", "unpaid", "overdue"],
              example: "paid",
            },
          },
        },

        UpdateSubscriptionInput: {
          type: "object",
          properties: {
            memberId: { type: "string", example: "member-123" },
            planName: { type: "string", example: "Monthly Premium" },
            startDate: {
              type: "string",
              format: "date-time",
              example: "2026-04-06T00:00:00.000Z",
            },
            endDate: {
              type: "string",
              format: "date-time",
              example: "2026-05-06T00:00:00.000Z",
            },
            price: { type: "number", example: 59.99 },
            isActive: { type: "boolean", example: false },
            paymentStatus: {
              type: "string",
              enum: ["paid", "unpaid", "overdue"],
              example: "overdue",
            },
          },
        },

        Visit: {
          type: "object",
          properties: {
            id: { type: "string", example: "visit-123" },
            memberId: { type: "string", example: "member-123" },
            visitDate: {
              type: "string",
              format: "date-time",
              example: "2026-04-06T00:00:00.000Z",
            },
            checkInTime: { type: "string", example: "09:00" },
            checkOutTime: { type: "string", example: "10:30" },
            notes: { type: "string", example: "Morning workout" },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-04-06T00:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-04-06T00:00:00.000Z",
            },
          },
        },

        CreateVisitInput: {
          type: "object",
          required: ["memberId", "visitDate", "checkInTime"],
          properties: {
            memberId: { type: "string", example: "member-123" },
            visitDate: {
              type: "string",
              format: "date-time",
              example: "2026-04-06T00:00:00.000Z",
            },
            checkInTime: { type: "string", example: "09:00" },
            checkOutTime: { type: "string", example: "10:30" },
            notes: { type: "string", example: "Morning workout" },
          },
        },

        UpdateVisitInput: {
          type: "object",
          properties: {
            memberId: { type: "string", example: "member-123" },
            visitDate: {
              type: "string",
              format: "date-time",
              example: "2026-04-06T00:00:00.000Z",
            },
            checkInTime: { type: "string", example: "09:00" },
            checkOutTime: { type: "string", example: "10:30" },
            notes: { type: "string", example: "Updated notes" },
          },
        },
      },
    },
  },
  apis: ["./src/api/v1/routes/*.ts"],
};

export const generateSwaggerSpec = (): object => swaggerJSDoc(swaggerOptions);