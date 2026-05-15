# Lumina FX - Frontend

Lumina FX Frontend is a premium, high-performance web application designed for real-time currency management and exchange. Built with a focus on speed, type safety, and a seamless user experience, it serves as the interface for the Lumina FX ecosystem.

---

## Technical Stack

The application leverages a cutting-edge stack to ensure a modern development workflow and a polished end-user experience:

-   **Framework**: Next.js 16 (App Router) with React 19.
-   **Language**: TypeScript for end-to-end type safety.
-   **Styling**: Tailwind CSS 4, utilizing a utility-first approach for high-performance, custom-designed interfaces.
-   **State Management**: 
    -   **Zustand**: For lightweight and scalable global client state.
    -   **TanStack Query (React Query)**: For robust server-state management, caching, and background data synchronization.
-   **Data Fetching**: Axios with interceptors for secure API communication.
-   **UI Components & Icons**: React Icons for a consistent visual language.
-   **Notifications**: Sonner for elegant, high-performance toast notifications.

---

## Key Features

-   **Real-time Dashboards**: Instant visibility of multi-currency balances.
-   **Interactive Exchange Interface**: Seamlessly convert between 10+ global currencies with live rate calculations.
-   **Secure Authentication Flows**: Integrated JWT handling with automatic token rotation support.
-   **Optimistic Updates**: Using React Query to provide immediate feedback on financial operations.
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.
-   **Type-Safe Financial Data**: Integration with backend precision standards to display accurate currency values.

---

## Getting Started

### Prerequisites
-   **Node.js**: v18.0.0 or higher (v20+ recommended).
-   **npm**: v9.0.0 or higher.

### Installation

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Environment Configuration

Create a `.env.local` file in the root of the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Running the Application

-   **Development Mode**: 
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

-   **Production Build**:
    ```bash
    npm run build
    npm start
    ```

---

## Project Structure

The project follows a modular and scalable directory structure:

```text
src/
├── app/            # Next.js App Router (pages and layouts)
├── components/     # Reusable UI components
├── constants/      # Global constants and config
├── hooks/          # Custom React hooks (logic reuse)
├── lib/            # Third-party library configurations (Axios, Query Client)
├── providers/      # React Context providers
├── store/          # Zustand global state definitions
├── types/          # TypeScript interfaces and types
├── utils/          # Helper functions and formatters
└── middleware.ts   # Next.js middleware for route protection
```

---

## Team Standards

-   **Clean Components**: We prioritize small, focused components for better maintainability.
-   **Type Safety**: Every API response and state object is strictly typed.
-   **Performance**: Minimized re-renders through efficient use of React Query and Zustand.
-   **User Experience**: Non-blocking UI and clear feedback loops for all financial operations.

---

## License
Licensed under the ISC License. Part of the Lumina FX financial engineering suite.
