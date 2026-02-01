# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in this QuizzBun repository.

## Project Structure

This is a full-stack quiz application with:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS (in `/frontend`)
- **Backend**: Express + TypeScript + PostgreSQL (in `/backend`)

## Build/Lint/Test Commands

### Frontend (React + Vite)
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Backend (Express + TypeScript)
```bash
cd backend

# Development server with hot reload
npm run dev
```

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode enabled** with `noUncheckedIndexedAccess` and `noImplicitOverride`
- **ESNext target** with modern features
- **Bundler module resolution** for optimal performance
- **React JSX** for components

### Import Organization
```typescript
// 1. React and core libraries
import React from "react";
import { create } from "zustand";

// 2. Third-party libraries
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

// 3. Internal imports (use @ alias for src)
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
```

### Component Patterns
- **Functional components** with TypeScript interfaces
- **Props destructuring** with proper typing
- **Forward refs** for UI components using Radix patterns
- **CVA (Class Variance Authority)** for variant-based styling

### State Management
- **Zustand** for global state (see `useQuestionsStore.ts`)
- **Type-safe stores** with TypeScript interfaces
- **Async actions** with proper error handling

### Styling Conventions
- **Tailwind CSS** for all styling
- **Utility-first approach** with `cn()` helper for class merging
- **Component variants** using CVA for consistent design system
- **Responsive design** with Tailwind breakpoints

### File Naming
- **PascalCase** for components (`Button.tsx`, `Game.tsx`)
- **camelCase** for utilities and hooks (`useQuestionsStore.ts`)
- **kebab-case** for CSS files if needed

### Error Handling
```typescript
// Async operations with try-catch
try {
  const response = await fetch("http://localhost:5173/data.json");
  if (!response.ok) throw "error fetching data";
  const data = await response.json();
  set({ questions: data });
} catch (error) {
  console.log("error:" + error);
}
```

### Database Patterns (Backend)
- **PostgreSQL** with connection pooling
- **Environment variables** for configuration
- **Express middleware** for JSON parsing
- **TypeScript** for type safety

### UI Component Structure
- **Shadcn/ui patterns** with Radix UI primitives
- **Consistent prop interfaces** extending standard HTML props
- **Slot composition** for flexible component rendering
- **Data attributes** for testing and styling hooks

### Type Definitions
- **Centralized types** in `types.d.ts` (frontend)
- **Interface naming** with descriptive names (`Questions`)
- **Union types** for constrained values (`"easy" | "medium" | "hard"`)
- **Optional properties** marked with `?`

## Development Workflow

1. **Start both servers**: Frontend on 5173, Backend on 3000
2. **Run linting** before commits: `npm run lint` (frontend)
3. **Type checking** handled by TypeScript compiler
4. **Hot reload** enabled in development for both frontend and backend

## Testing

Currently no test framework is configured. When adding tests:
- Consider **Vitest** for frontend (compatible with Vite)
- Consider **Jest** or **Mocha** for backend API testing
- Follow existing code patterns and TypeScript conventions

## Key Dependencies

### Frontend
- **React 19** with modern features
- **Zustand** for state management
- **Radix UI** for accessible primitives
- **Tailwind CSS v4** for styling
- **Lucide React** for icons

### Backend
- **Express 5** for API server
- **PostgreSQL** with `pg` driver
- **dotenv** for environment configuration
- **TypeScript** for type safety

## Notes for Agents

- **No test framework** currently - add one if needed for testing
- **ESLint configured** with React and TypeScript rules
- **Path aliases** configured: `@/*` maps to `src/*` in frontend
- **Strict TypeScript** - ensure all code passes type checking
- **Component library** follows shadcn/ui patterns for consistency