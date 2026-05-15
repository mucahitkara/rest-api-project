# Real Time Currency Exchange Project

## Team Members

| Name | Role | Student ID |
| :--- | :--- | :--- |
| Mucahit Karakus | Project Manager, Backend Developer | 47469 |
| Murat Serkan Kayar | Backend Developer | 55912 |
| Murat Tavan | Frontend Developer | 66618 |
| Omurbek Uraimov | Frontend Developer | 54167 |
| Alp Türkoğlu | Tester | 62891 |

---

## Project Vision: Lumina FX

Lumina FX is a comprehensive, enterprise-grade financial ecosystem designed to provide users with a secure, real-time platform for multi-currency management and exchange. Developed by a collaborative engineering team, this project bridges the gap between complex financial operations and intuitive user experience. Our mission was to build a system where financial integrity, security, and performance are never compromised.

---

## Technical Overview

The ecosystem is built on a modern decoupled architecture, ensuring scalability and maintainability. It consists of a robust Node.js REST API and a high-performance Next.js web application.

### Tech Stack Summary
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS 4, Zustand, React Query
- **Backend**: Node.js, Express, MongoDB, Mongoose (Decimal128)
- **Database**: MongoDB (supporting ACID transactions)
- **APIs**: National Bank of Poland (NBP) API for real-time rates

---

## Getting Started

### Prerequisites
To run this project, you need the following installed:
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB**: v6.0 or higher (Local or Atlas)

### Environment Configuration

Before running the application, you must set up the environment variables.

#### Backend (`/backend/.env`)
Create a `.env` file in the `backend` directory and add the following:
```env
# Database
MONGO_URL=mongodb://localhost:27017/currency_exchange

# JWT Secrets
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS (Frontend URL)
FRONTEND_URL=http://localhost:3000

# Email (for account verification)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Transaction Limits (USD)
MAX_TRANSACTION_AMOUNT=10000
DAILY_TRANSACTION_LIMIT=50000
```

#### Frontend (`/frontend/.env.local`)
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## Installation and Execution

### 1. Database Setup
Ensure your MongoDB service is running. If using MongoDB Atlas, update the `MONGO_URL` in your backend `.env` with your connection string.

### 2. Running the Backend
```bash
cd backend
npm install
# To run in development mode (with nodemon):
npm run dev
# To run in production mode:
npm start
```
The server will start on `http://localhost:8000`. You can access the API documentation at `http://localhost:8000/api-docs`.

### 3. Running the Frontend
```bash
cd frontend
npm install
# To run in development mode:
npm run dev
# To build and run in production mode:
npm run build
npm start
```
The application will be available at `http://localhost:3000`.

### 4. Running Tests
The project includes a comprehensive test suite for the backend.
```bash
cd backend
npm test
```

---

## Detailed Architecture

### Backend Infrastructure (The Engine)
The backend is engineered for high-stakes financial operations, focusing on "Zero Trust" data handling and ACID compliance.

- **Core Runtime**: Node.js and Express.js for a lightweight yet powerful server environment.
- **Financial Integrity**: Uses **Mongoose Decimal128** for all calculations to eliminate JavaScript floating-point errors.
- **Security Architecture**:
    - JWT Access/Refresh token rotation.
    - Protection against NoSQL Injection and ReDoS.
    - Centralized global error handling for production safety.

### Frontend Experience (The Interface)
- **Framework**: Next.js 16 utilizing React 19 features.
- **Styling Engine**: Tailwind CSS 4 for a optimized design system.
- **State Management**: Zustand for lightweight global state.
- **Data Synchronization**: TanStack Query for efficient server state management.

---

## Core Ecosystem Features
1. **High-Precision Transactions**: Atomic MongoDB sessions ensure money is never "lost" during transfers.
2. **Real-time Rates**: Direct integration with the NBP API for up-to-the-minute exchange values.
3. **Security Audit**: Completed fixes for BOLA (Broken Object Level Authorization) and regex injection.
4. **Transaction Limits**: Server-side enforced limits to prevent fraudulent large-scale operations.

---

## Team Standards & Philosophy
We follow a strict MVC pattern on the backend and a modular component architecture on the frontend. Every pull request undergoes a security review, focusing on preventing common financial vulnerabilities.

---

## License
Licensed under the ISC License. Developed as a professional demonstration of modern full-stack financial engineering.
