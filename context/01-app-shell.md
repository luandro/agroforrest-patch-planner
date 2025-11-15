# App Shell & Routing

## Purpose
Bootstraps the SPA, wires global providers, and defines top-level routes/pages that compose the agroforestry patch planner UX.

## Key Files & Directories
- `src/main.tsx` – Entrypoint that mounts `<App />` via `createRoot` and injects global styles from `index.css`.
- `src/App.tsx` – Sets up `QueryClientProvider`, Radix/Sonner toasters, and `BrowserRouter` routes for `/`, `/dashboard`, `/patch-creator`, and the 404 catch-all.
- `src/pages/` – Page components (`LandingPage`, `DashboardPage`, `PatchCreatorPage`, `NotFoundPage`) that stitch features/layouts into routed screens.
- `src/components/layout/MainLayout.tsx` – Shared page chrome (header, patch selector slot, responsive menus) used by dashboard and patch creator views.

## Primary Components & Functions
- `App` component – Declares all providers (React Query, tooltip, notifications) and React Router route table.
- `LandingPage`/`DashboardPage` – Marketing and analytic placeholders; useful templates for new sections.
- `PatchCreatorPage` – Orchestrates canvas + plant selection experience, instantiating offline storage and patch state before rendering.
- `MainLayout` – Responsive frame that toggles user menu mode and patch selector injection.

## External Dependencies
- `react-router-dom` for client-side routing.
- `@tanstack/react-query` for data caching (query client lives at App level even though queries are not yet implemented).
- `sonner` + Radix toaster primitives for notifications.

## Context Tips
- Adding a new route means touching both `src/pages/<NewPage>.tsx` and the `<Routes>` block in `App.tsx`.
- Providers in `App.tsx` wrap the entire tree; ensure new global contexts are placed there to avoid double-mounting.
- `PatchCreatorPage` assumes it is wrapped by `MainLayout`; if you introduce alternative layouts, ensure patch-specific controls still get the necessary props (fit, create, patch switch callbacks).
