// OpenAPI 3.0 specification for the Currency Exchange REST API.
// Served via swagger-ui-express in app.js at /api-docs.

const messageResponse = {
  type: "object",
  properties: { message: { type: "string" } },
};

const userSummary = {
  type: "object",
  properties: {
    userid: { type: "string", example: "66b1f0c2e1a2b3c4d5e6f7a8" },
    username: { type: "string", example: "john@example.com" },
    firstName: { type: "string", example: "John" },
    lastName: { type: "string", example: "Doe" },
  },
};

const transaction = {
  type: "object",
  properties: {
    _id: { type: "string" },
    type: { type: "string", enum: ["send", "exchange"], example: "send" },
    amount: { type: "number", example: 100 },
    currency: { type: "string", example: "USD" },
    date: { type: "string", format: "date-time" },
    senderName: { type: "string", example: "John Doe" },
    targetName: { type: "string", example: "Jane Smith" },
  },
};

const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Currency Exchange REST API",
    version: "1.0.0",
    description:
      "REST API for a multi-currency wallet: authentication, balances, transfers, currency exchange and transaction history.",
  },
  servers: [
    { url: "/api/v1", description: "Current host" },
    { url: "http://localhost:8000/api/v1", description: "Local development" },
  ],
  tags: [
    { name: "User", description: "Authentication and user management" },
    { name: "Account", description: "Balances, transfers and exchange" },
    { name: "Transaction", description: "Transaction history" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Message: messageResponse,
      UserSummary: userSummary,
      Transaction: transaction,
    },
  },
  paths: {
    "/user/signup": {
      post: {
        tags: ["User"],
        summary: "Register a new user",
        description:
          "Creates a user and a multi-currency account (seeded with 1000 USD), returns access and refresh tokens.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "password", "firstName", "lastName"],
                properties: {
                  username: { type: "string", format: "email", example: "john@example.com" },
                  password: { type: "string", format: "password", example: "Str0ngP@ss" },
                  firstName: { type: "string", example: "John" },
                  lastName: { type: "string", example: "Doe" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "User registered",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    accessToken: { type: "string" },
                    refreshToken: { type: "string" },
                    userId: { type: "string" },
                  },
                },
              },
            },
          },
          400: { description: "Validation error", content: { "application/json": { schema: messageResponse } } },
          409: { description: "Email already in use", content: { "application/json": { schema: messageResponse } } },
          500: { description: "Signup failed", content: { "application/json": { schema: messageResponse } } },
        },
      },
    },
    "/user/signin": {
      post: {
        tags: ["User"],
        summary: "Authenticate a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "password"],
                properties: {
                  username: { type: "string", format: "email", example: "john@example.com" },
                  password: { type: "string", format: "password", example: "Str0ngP@ss" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    accessToken: { type: "string" },
                    refreshToken: { type: "string" },
                  },
                },
              },
            },
          },
          400: { description: "Validation error", content: { "application/json": { schema: messageResponse } } },
          401: { description: "Invalid credentials", content: { "application/json": { schema: messageResponse } } },
        },
      },
    },
    "/user/refresh": {
      post: {
        tags: ["User"],
        summary: "Exchange a refresh token for a new access token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refreshToken"],
                properties: { refreshToken: { type: "string" } },
              },
            },
          },
        },
        responses: {
          200: {
            description: "New access token",
            content: {
              "application/json": {
                schema: { type: "object", properties: { accessToken: { type: "string" } } },
              },
            },
          },
          401: { description: "Refresh token required", content: { "application/json": { schema: messageResponse } } },
          403: { description: "Invalid or expired refresh token", content: { "application/json": { schema: messageResponse } } },
        },
      },
    },
    "/user/verify-email/{token}": {
      get: {
        tags: ["User"],
        summary: "Verify email address using the emailed token",
        parameters: [
          { name: "token", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Email verified", content: { "application/json": { schema: messageResponse } } },
          404: { description: "Invalid verification token", content: { "application/json": { schema: messageResponse } } },
        },
      },
    },
    "/user/logout": {
      post: {
        tags: ["User"],
        summary: "Log out (invalidate a refresh token)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refreshToken"],
                properties: { refreshToken: { type: "string" } },
              },
            },
          },
        },
        responses: {
          200: { description: "Logged out", content: { "application/json": { schema: messageResponse } } },
          400: { description: "Refresh token required", content: { "application/json": { schema: messageResponse } } },
          401: { description: "Unauthorized", content: { "application/json": { schema: messageResponse } } },
        },
      },
    },
    "/user/resend-verification": {
      post: {
        tags: ["User"],
        summary: "Resend the email verification message",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Verification email sent", content: { "application/json": { schema: messageResponse } } },
          400: { description: "Email already verified", content: { "application/json": { schema: messageResponse } } },
          401: { description: "Unauthorized", content: { "application/json": { schema: messageResponse } } },
        },
      },
    },
    "/user/getUser": {
      get: {
        tags: ["User"],
        summary: "Get the current authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Current user",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized", content: { "application/json": { schema: messageResponse } } },
          404: { description: "User not found", content: { "application/json": { schema: messageResponse } } },
        },
      },
    },
    "/user/getAllUsers": {
      get: {
        tags: ["User"],
        summary: "List all users (admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "All users",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { users: { type: "array", items: userSummary } },
                },
              },
            },
          },
          401: { description: "Unauthorized", content: { "application/json": { schema: messageResponse } } },
          403: { description: "Admin access required", content: { "application/json": { schema: messageResponse } } },
        },
      },
    },
    "/user/bulk": {
      get: {
        tags: ["User"],
        summary: "Search users by name (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "filter", in: "query", required: false, schema: { type: "string" }, description: "Case-insensitive name filter" },
        ],
        responses: {
          200: {
            description: "Matching users",
            content: {
              "application/json": {
                schema: { type: "object", properties: { users: { type: "array", items: userSummary } } },
              },
            },
          },
          401: { description: "Unauthorized", content: { "application/json": { schema: messageResponse } } },
          403: { description: "Admin access required", content: { "application/json": { schema: messageResponse } } },
        },
      },
    },
    "/user/otherusers": {
      get: {
        tags: ["User"],
        summary: "Search users other than the current one",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "filter", in: "query", required: false, schema: { type: "string" }, description: "Case-insensitive name filter" },
        ],
        responses: {
          200: {
            description: "Matching users",
            content: {
              "application/json": {
                schema: { type: "object", properties: { users: { type: "array", items: userSummary } } },
              },
            },
          },
          401: { description: "Unauthorized", content: { "application/json": { schema: messageResponse } } },
        },
      },
    },
    "/account/balance": {
      get: {
        tags: ["Account"],
        summary: "Get balances and wallet numbers for the current user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Balances and wallet numbers",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    balances: {
                      type: "object",
                      additionalProperties: { type: "string" },
                      example: { USD: "1000", EUR: "0", GBP: "0" },
                    },
                    walletNumbers: {
                      type: "object",
                      additionalProperties: { type: "string" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized", content: { "application/json": { schema: messageResponse } } },
          404: { description: "Account not found", content: { "application/json": { schema: messageResponse } } },
        },
      },
    },
    "/account/transfer": {
      post: {
        tags: ["Account"],
        summary: "Transfer funds to another user",
        description: "Recipient identified by either userId (`to`) or `walletNumber` for the given currency.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["currency", "amount"],
                properties: {
                  to: { type: "string", description: "Recipient userId (use this OR walletNumber)" },
                  walletNumber: { type: "string", description: "Recipient wallet number (use this OR to)" },
                  currency: { type: "string", example: "USD" },
                  amount: { type: "number", example: 100 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Transfer successful", content: { "application/json": { schema: messageResponse } } },
          400: { description: "Validation error / insufficient funds / over limit", content: { "application/json": { schema: messageResponse } } },
          401: { description: "Unauthorized", content: { "application/json": { schema: messageResponse } } },
          404: { description: "Receiver or wallet not found", content: { "application/json": { schema: messageResponse } } },
          500: { description: "Transfer failed", content: { "application/json": { schema: messageResponse } } },
        },
      },
    },
    "/account/exchange": {
      post: {
        tags: ["Account"],
        summary: "Exchange between two currencies",
        description: "Target amount is computed server-side from live rates; `toAmount` from the client is ignored.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fromCurrency", "toCurrency", "fromAmount"],
                properties: {
                  fromCurrency: { type: "string", example: "USD" },
                  toCurrency: { type: "string", example: "EUR" },
                  fromAmount: { type: "number", example: 100 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Exchange successful", content: { "application/json": { schema: messageResponse } } },
          400: { description: "Validation error / insufficient funds / over limit", content: { "application/json": { schema: messageResponse } } },
          401: { description: "Unauthorized", content: { "application/json": { schema: messageResponse } } },
          404: { description: "User not found", content: { "application/json": { schema: messageResponse } } },
          500: { description: "Exchange failed", content: { "application/json": { schema: messageResponse } } },
        },
      },
    },
    "/account/lookup/{walletNumber}": {
      get: {
        tags: ["Account"],
        summary: "Look up the (masked) owner of a wallet number",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "walletNumber", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "Masked owner details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    firstName: { type: "string", example: "J***" },
                    lastName: { type: "string", example: "D**" },
                    currency: { type: "string", example: "USD" },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized", content: { "application/json": { schema: messageResponse } } },
          404: { description: "Wallet number not found", content: { "application/json": { schema: messageResponse } } },
        },
      },
    },
    "/transaction/history": {
      get: {
        tags: ["Transaction"],
        summary: "List the current user's transactions",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Transaction list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { transactions: { type: "array", items: transaction } },
                },
              },
            },
          },
          401: { description: "Unauthorized", content: { "application/json": { schema: messageResponse } } },
          500: { description: "Failed to fetch history", content: { "application/json": { schema: messageResponse } } },
        },
      },
    },
    "/transaction/history/{id}": {
      get: {
        tags: ["Transaction"],
        summary: "Get a single transaction by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "Transaction",
            content: {
              "application/json": {
                schema: { type: "object", properties: { transaction } },
              },
            },
          },
          401: { description: "Unauthorized", content: { "application/json": { schema: messageResponse } } },
          403: { description: "Not authorized to view this transaction", content: { "application/json": { schema: messageResponse } } },
          404: { description: "Transaction not found", content: { "application/json": { schema: messageResponse } } },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
