# Layout & UI Kit

## Purpose
Provides reusable layout primitives, shadcn-based design system components, and the slide-in user menu used across dashboard and patch-creator screens.

## Key Files & Directories
- `src/components/layout/MainLayout.tsx` – Page chrome with header, patch selector slot, and desktop/mobile menu handling.
- `src/components/UserMenu.tsx` – Slide-out control center that triggers fit/reset/export actions tied to the canvas stores.
- `src/components/ui/` – Generated shadcn components (button, dialog, tabs, toast, etc.) mapped to Radix primitives and tailwind semantics.
- `components.json` – shadcn component manifest; use `npx shadcn-ui@latest add <component>` to regenerate entries.

## Major Elements
- `MainLayout` – Accepts props such as `showUserMenu`, `showPatchSelector`, and patch callbacks; internally composes lucide icons and Zustand `useMenuStore`.
- `UserMenu` – Uses dialogs, forms, and toasts to expose bed management, exports, and destructive actions; listens to Escape/backdrop interactions.
- UI components (e.g., `Button`, `Dialog`, `Toaster`) – Encapsulate styling + behavior for consistent look/feel; `cn` helper merges classes.

## External Dependencies
- `lucide-react` icons across layout/menu.
- Radix UI primitives (pulled in via shadcn) and Tailwind CSS utility classes defined in `tailwind.config.ts`.
- Custom toast hook `src/hooks/use-toast.ts` (wraps Sonner) for notifications emitted from the menu.

## Context Tips
- When tweaking layout spacing/behavior, update `MainLayout` rather than duplicating structure in pages.
- New UI primitives should be generated through shadcn CLI to keep typings and `components.json` in sync.
- `UserMenu` touches persistent stores (bed data, menu state) and local/session storage for destructive actions; audit these flows before reusing in other contexts.
