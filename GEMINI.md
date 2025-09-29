# GEMINI Project Context: VT_DANTE_LAB

## Project Overview

This project is a web application named "Dante AI", designed as a specialized chatbot for answering questions about Brazilian real estate registration law ("Registro de Imóveis"). The application features a user authentication system (login, registration, password reset) and a chat interface.

The backend is powered by Supabase, utilizing its database, authentication services, and edge functions. The frontend is built with React, Vite, and TypeScript, and styled with Tailwind CSS and shadcn/ui components.

**Key Technologies:**

*   **Frontend:** React 18, Vite, TypeScript
*   **Styling:** Tailwind CSS, shadcn/ui, Radix UI
*   **Backend:** Supabase (Database, Auth, Edge Functions)
*   **Routing:** React Router
*   **Linting:** ESLint

**Architecture:**

*   The application is a single-page application (SPA) built with Vite.
*   The `src` directory contains the main source code, organized into `pages`, `components`, `utils`, and `services`.
*   User authentication is managed through a combination of client-side logic in `src/components/auth/AuthProvider.tsx` and server-side Supabase edge functions.
*   The chat interface is composed of several React components in `src/components/`, and currently uses hardcoded responses to simulate an AI.
*   Supabase edge functions are written in Deno/TypeScript and are located in the `supabase/functions` directory.

## Building and Running

*   **Install dependencies:**
    ```bash
    npm install
    ```

*   **Run the development server:**
    ```bash
    npm run dev
    ```

*   **Build for production:**
    ```bash
    npm run build
    ```

*   **Lint the code:**
    ```bash
    npm run lint
    ```

*   **Preview the production build:**
    ```bash
    npm run preview
    ```

## Development Conventions

*   **Coding Style:** The codebase uses TypeScript with React. Components are written as functional components using hooks. The code is formatted according to the ESLint configuration in the project.
*   **Component Structure:** Components are located in `src/components` and are often broken down into smaller, more manageable files. `shadcn/ui` is used for UI components.
*   **State Management:** Global authentication state is managed via React Context in `AuthProvider.tsx`. Component-level state is managed with `useState` and other React hooks.
*   **Supabase Interaction:** Supabase client is initialized in `services/supa_init.ts`. Edge functions are used for secure server-side operations.
*   **Testing:** There are no dedicated test files in the project currently. A good next step would be to add a testing framework like Vitest or React Testing Library.
*   **Multi-tenancy:** The discarded migrations suggest a planned or in-progress multi-tenancy feature with a `companies` table. This should be taken into account when developing new features.
