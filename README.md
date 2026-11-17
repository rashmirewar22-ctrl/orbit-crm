# Orbit CRM

A small, front-end-only CRM built with React. Landing page, authentication, a
contacts workbook, a drag-and-drop deal pipeline and a dashboard — all running in
the browser with data kept in `localStorage`. Light and dark themes throughout.

## Stack

- React 18 + Vite
- React Router 6
- Plain CSS with a token-based design system (no UI library)
- `localStorage` for auth and CRM data (no backend)

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Demo login

```
email:    demo@orbit.io
password: orbit123
```

Or create a new account from the Sign up page — accounts are stored locally.

## What's inside

- **Landing page** — hero, product mock, features, stats, testimonial, footer
- **Auth** — sign up / log in with validation, password strength meter, protected routes
- **Dashboard** — KPI cards, pipeline-by-stage bars, contacts donut, recent activity
- **Contacts** — search, status filter, sortable table, create / edit / delete, detail view with notes
- **Pipeline** — drag deals across stages, add / remove deals, probability bars
- **Settings** — theme switch, preference toggles, reset demo data
- Toast notifications, keyboard-dismissible modals, responsive down to mobile

## Structure

```
src/
  context/     theme, auth, toast and CRM state
  hooks/       useLocalStorage
  components/  shared UI (Icon, Avatar, Modal, Logo, ...)
  pages/       Landing, Login, Signup, Dashboard, Contacts, ContactDetail, Deals, Settings
  layouts/     AppLayout (sidebar + topbar)
  utils/       formatting helpers
  data/        seed data
```
