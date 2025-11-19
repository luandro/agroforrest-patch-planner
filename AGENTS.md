# Repository Guidelines

## Context Overview
Module briefs live in `./context/`; open the relevant file before editing.
- [01-app-shell](./context/01-app-shell.md) – App providers, routing, and entry pages.
- [02-layout-and-ui](./context/02-layout-and-ui.md) – Shared layouts, shadcn kit, slide-out menu.
- [03-canvas-engine](./context/03-canvas-engine.md) – Canvas components, hooks, renderers, species data.
- [04-patch-creator-flow](./context/04-patch-creator-flow.md) – Page-level orchestration tying canvas + UI state.
- [05-state-and-storage](./context/05-state-and-storage.md) – Zustand slices, auto-save orchestrator, IndexedDB helpers.
- [06-build-and-config](./context/06-build-and-config.md) – Tooling, scripts, Tailwind, ESLint, Vite.

## Project Structure & Module Organization
`src/pages` holds routed views, `src/features` holds domain packages (canvas + patch creator), `src/components` bundles layout/UI primitives, `src/stores` contains Zustand slices, and `src/hooks`/`src/lib` expose shared helpers. Assets stay in `public/`; `dist/` is disposable. Always import through the `@/` alias.

## Build, Test, and Development Commands
- `npm run dev` – Vite + HMR on http://localhost:5173.
- `npm run build` / `npm run build:dev` – production vs. debug bundles into `dist/`.
- `npm run preview` – serve the compiled bundle.
- `npm test` – Run Vitest test suite (162 tests covering retry logic, validation schemas, utilities).
- `npm run lint` – ESLint (TypeScript + React Hooks) gate prior to PRs. Tooling nuances live in `./context/06-build-and-config.md`.

## Coding Style & Naming Conventions
Favor function components + hooks, lean on React Query for async flows, and style locally with Tailwind utility stacks (tune tokens in `tailwind.config.ts`). Components/hooks/stores use PascalCase, helpers stay camelCase, and files mirror their default export. UI specifics sit in `./context/02-layout-and-ui.md`.

## Testing Guidelines
Vitest + Testing Library are configured. Tests are co-located with source files (`ComponentName.test.tsx`). Run `npm test` before PRs. Current test coverage includes retry logic, validation schemas, and canvas utilities. Persistence-heavy work must be browser-tested because IndexedDB mocks are absent—see `./context/05-state-and-storage.md` for pitfalls.

## Commit & Pull Request Guidelines
Write short, imperative commits with optional scopes (`docs: Add architecture review issues list`). PRs should summarize intent, link the driving issue/task, note testing commands + results, and attach screenshots/GIFs when UI shifts. Rebase on `main`, then ensure `npm run lint && npm run build` succeed.

## Agent Workflow Tips
Install deps via `npm install` (npm lockfile is canonical). After touching dependencies or configs, rerun `npm run lint` to catch typing drift. Prefer centralized edits (`tailwind.config.ts`, `vite.config.ts`, `tsconfig.*`) and check the relevant context file before editing a module.

## Usage for the Coding Agent
When working inside module X, open `./context/<file>.md` for its responsibilities, entry points, and caveats. To add a new area, drop another numbered file into `./context/` and update the list above.
