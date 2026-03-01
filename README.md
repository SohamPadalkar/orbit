# Orbit — Personal Life Manager

Minimal React app to track personal care, subscriptions, expenses, goals, renewals, wishlist items, and habits.

## Stack

- React + Vite + TypeScript
- TailwindCSS (v4)
- Zustand with LocalStorage persistence
- React Router
- Framer Motion
- Lucide Icons
- Recharts
- PWA support (`vite-plugin-pwa`)

## Run

```bash
npm install
npm run dev
```

Build and lint:

```bash
npm run build
npm run lint
```

## Architecture Notes

- `src/store/useOrbitStore.ts`: Single persisted source of truth for all trackers, plus import/export and undo-delete.
- `src/components/layout/AppLayout.tsx`: Dashboard shell, sidebar/mobile nav, search, dark mode, and quick actions.
- `src/components/quick-add/QuickAddModal.tsx`: Global modal-based create flow triggered by floating `+` button.
- `src/pages/*`: Focused page modules for each tracker with minimal interactions and analytics visuals.
- `src/components/ui/*`: Reusable primitives (Card, Button, Input, Modal, Toggle, ProgressBar, Badge, Tabs).

## Keyboard Shortcuts

- `N` → Open quick add modal
- `D` → Toggle dark mode

## Data Backup

- Use `Export` in header to download JSON backup.
- Use `Import` to restore from backup JSON.
