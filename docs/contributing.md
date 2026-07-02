# Contributing to Saarthi

## Core Principles

1.  **Safety Over Speed:** Ensure that changes do not break the `v1.0-clean-baseline` build or introduce runtime risks. High-risk React hooks refactoring should only be done thoughtfully.
2.  **No Unnecessary Churn:** Avoid sweeping codebase renames unless solving an actual duplication issue. Keep files small but don't prematurely abstract.
3.  **Run Verifications:** Always run `npm run verify` before committing.

## Pre-Merge Checklist

- [ ] Does `npm run verify` pass? (lint, type-check, build)
- [ ] Are new files in the correct architectural folder?
- [ ] Has `docs/` been updated if the change alters the system's architecture?
- [ ] Are environment variables added to `src/lib/env.ts`?
