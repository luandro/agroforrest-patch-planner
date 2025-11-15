# Build & Configuration

## Purpose
Defines the toolchain, linting/formatting, Tailwind tokens, and shadcn setup that underpin the React/Vite workspace.

## Key Files
- `package.json` – Scripts (`dev`, `build`, `build:dev`, `preview`, `lint`) plus dependency graph (Vite, React 18, shadcn/Radix deps, Zustand, React Query).
- `vite.config.ts` – Configures React SWC plugin, Lovable component tagger (development only), host `::`, port `8080`, and sets `@` alias to `./src`.
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` – TypeScript compiler options, path aliases, relaxed strictness toggles for this prototype.
- `tailwind.config.ts` – Content globs, color tokens, sidebar palette, animations, and plugin registration (`tailwindcss-animate`).
- `eslint.config.js` – ESLint flat config with JS + TypeScript presets, React Hooks rules, and refresh constraints.
- `postcss.config.js`, `components.json`, `bun.lockb` / `package-lock.json` – Additional tooling manifests.

## External Dependencies & Tools
- Vite 5 + React SWC plugin for dev server/bundling.
- Tailwind CSS 3.4 with `@tailwindcss/typography` (via devDependencies) and shadcn UI generator.
- ESLint 9 + `typescript-eslint` for linting; `npm run lint` should pass pre-merge.

## Context Tips
- Respect the `@` alias when importing from `src/`; mixed relative paths complicate tree-shaking and context references.
- Tailwind tokens (colors, radii, animations) should be extended centrally in `tailwind.config.ts` rather than inline values.
- When adding dependencies, prefer `npm` (lockfile of record). Run `npm run lint` after installs to catch typing regressions noted in `AGENTS.md`.
- If you change dev server port or host, also update deployment configs or documentation referencing `localhost:5173` vs. `8080` (Vite config overrides default port).
