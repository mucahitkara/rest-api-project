# Currency Exchange REST API - Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

A high-performance, secure, and production-ready RESTful API for a multi-currency wallet application. This backend handles user authentication, real-time currency exchange rates via NBP API, high-precision financial transactions, and comprehensive security auditing.

---

## Key Features

-   **Robust Authentication**: JWT-based auth with access and refresh tokens (1h/7d expiry).
-   **Multi-Currency Accounts**: Support for 10 currencies (USD, EUR, GBP, PLN, UZS, etc.).
-   **Real-time Exchange Rates**: Integrated with the **National Bank of Poland (NBP) API** for live market data.
-   **Advanced Security**:
    -   Protection against NoSQL injection, XSS, and Brute Force.
    -   Bcrypt password hashing (10 salt rounds).
    -   Regex Injection (ReDoS) protection on search filters.
    -   BOLA (Broken Object Level Authorization) fixes for transaction privacy.
-   **Financial Integrity**:
    -   Uses **Mongoose Decimal128** for high-precision calculations (eliminating JS floating-point errors).
    -   ACID-compliant transactions using MongoDB Sessions.
    -   Server-side rate verification (prevents "money minting" from client-side manipulation).
-   **API Documentation**: Interactive Swagger/OpenAPI 3.0 documentation.
-   **Email Verification**: Mandatory email verification for financial operations.

---

## Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Core** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose (Decimal128) |
| **Security** | Helmet, CORS (Whitelist), Express-Rate-Limit, Express-Mongo-Sanitize |
| **Auth** | JSON Web Tokens (JWT), Bcrypt |
| **Validation** | Joi, Zod |
| **Utilities** | Morgan (Logging), Nodemailer, Node Fetch API |
| **Testing** | Jest, Supertest, MongoDB Memory Server |
| **Docs** | Swagger UI Express, Swagger JSDoc |

---

## Project Structure

```text
backend/
├── config/              # DB connection, JWT, and Swagger configs
├── controllers/         # Business logic (User, Account, Transaction)
├── middlewares/         # Auth, Rate Limiting, and Security middlewares
├── models/              # Mongoose schemas (User, Account, Transaction)
├── routes/              # API Route definitions (/api/v1)
├── validators/          # Joi/Zod input validation schemas
├── utils/               # NBP API service, Email service, Limit checks
├── tests/               # Unit and Integration tests
├── app.js               # Express app configuration
└── server.js            # Entry point
```

---

## Getting Started

### Prerequisites
-   Node.js (v18+)
-   MongoDB instance (Local or Atlas)

### Installation

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    ```bash
    cp .env.example .env
    ```
    *Edit `.env` with your MongoDB URI, JWT secrets, and SMTP credentials.*

### Running the Server

-   **Development Mode**: `npm run dev` (starts server with nodemon)
-   **Production Mode**: `npm start`
-   **Run Tests**: `npm test`

---

## API Documentation

Once the server is running, you can access the interactive Swagger documentation at:
`http://localhost:8000/api-docs`

This provides a detailed overview of all endpoints, including:
-   `POST /api/v1/user/signup` - Register with email verification.
-   `POST /api/v1/user/signin` - Secure login with token rotation.
-   `POST /api/v1/account/transfer` - ACID-compliant money transfers.
-   `POST /api/v1/account/exchange` - Real-time currency exchange using NBP rates.

---

## Security & Financial Integrity

This backend was built with a "Zero Trust" policy regarding client-side data for financial operations:
-   **Rate Caching**: NBP rates are cached for 15 minutes to balance performance and accuracy.
-   **Transaction Limits**: Configurable single ($10k) and daily ($50k) USD-equivalent limits.
-   **Role-Based Access**: Sensitive administrative endpoints are restricted to `admin` roles.
-   **Privacy**: Public wallet lookups mask usernames (e.g., `J*** D***`).

---

## License
ISC License. Built for educational and professional demonstration purposes.
