# Contributing to Saarthi

## Core Principles

1.  **Safety Over Speed:** Ensure that changes do not break the `v1.0-clean-baseline` build or introduce runtime risks. High-risk React hooks refactoring should only be done thoughtfully.
2.  **No Unnecessary Churn:** Avoid sweeping codebase renames unless solving an actual duplication issue. Keep files small but don't prematurely abstract.
3.  **Run Verifications:** Always run `npm run verify` before committing.

## Architectural Standards (Sprint 2.1)

### 1. Presentation vs Logic Separation
All UI components must remain purely presentational. They should not:
- Fetch data from APIs
- Use global state directly (Context, Redux, etc.)
- Handle complex business logic

They should:
- Accept data via props
- Emit events via callbacks
- Only contain local UI state (e.g., expanded/collapsed, animations)

### 2. Page Components as Orchestrators
Page components (e.g., `src/app/page.tsx`) must remain extremely thin. Their only responsibilities are:
- Invoking orchestrator hooks to retrieve data
- Rendering the loading/error/empty states
- Composing presentational components and passing props

### 3. Hooks for Business Logic
All business logic should be extracted into specialized custom hooks in the `src/hooks/` directory. 
- **Orchestrator Hooks:** (e.g., `useHomeData`) combine multiple specialized hooks to provide all necessary props for a page.
- **Specialized Hooks:** (e.g., `useAlerts`, `useLiveStatus`) manage specific domains of logic.

### 4. Shared UI Components
Common UI states should use our shared components in `src/components/common/`:
- `<LoadingState />`
- `<ErrorState />`
- `<EmptyState />`

### 5. Types
All shared types and interfaces should live in the `src/types/` directory. Component-specific prop types can remain in the component file, but domain models (e.g., `HomeData`, `LiveStatus`) must be centralized.

## Adding New Features
When adding a new section or feature to a page:
1. Update the appropriate `src/types/` definitions.
2. Implement the logic in a specialized hook in `src/hooks/`.
3. Add the new state/methods to the page's orchestrator hook.
4. Create a pure presentational component in `src/components/`.
5. Compose the new component in the page file.

## Pre-Merge Checklist

- [ ] Does `npm run verify` pass? (lint, type-check, build)
- [ ] Are new files in the correct architectural folder?
- [ ] Has `docs/` been updated if the change alters the system's architecture?
- [ ] Are environment variables added to `src/lib/env.ts`?
