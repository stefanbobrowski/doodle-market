# Doodle Market

```
         '::.
    _________H ,%%&%,
   /\     _   \%&&%%&%
  /  \___/^\___\%&%%&&
  |  | []   [] |%\Y&%'
  |  |   .-.   | ||
~~@._|@@_|||_@@|~||~~~~~~~~~~~~~
      """) )"""
```

A full-stack Vite, React, TypeScript, Express app for uploading, selling, and rating doodles. Demonstrates backend concepts like JWT authentication, ownership-based authorization, purchase flow, transactional emails, audit logging, rate limiting, integration testing, and admin tooling.

## Features

- **Browse & View**: Gallery of doodles with view and like counters.
- **Upload Doodles**: Authenticated users can upload images with titles, descriptions, and prices. 5MB limit, images only, rate-limited to 5 uploads per hour.
- **Edit & Delete**: Owners (and admins) can edit doodle details or replace the image, and delete with a two-step confirmation.
- **Ownership Badges**: Doodle cards show an owner badge for your own doodles. Edit/Delete controls are only shown to the owner or admin.
- **Purchase Flow**: Buy doodles using a demo account balance. Blocks self-purchase and enforces sufficient funds.
- **Transactional Email**: Purchase confirmation email sent via the Resend API with an itemized receipt.
- **JWT Auth**: Login returns a signed JWT (24h expiry) stored in localStorage and sent as a Bearer token on authenticated requests.
- **Demo Accounts**: Two preset user accounts (`pixel_pete`, `sketch_sam`) with quick-fill buttons on the login page. Admin account is intentionally not shown on the login UI.
- **Admin Dashboard**: Admin-only page to reset the entire app to seed state and wipe user-uploaded doodles, restores 5 seed doodles, and resets all account balances.
- **Audit Logging**: Key events (uploads, purchases, edits, deletes, likes, views, resets) are appended to `logs/audit.json` with timestamps, usernames, and event data. A collapsible sidebar on every page displays the live log with color-coded event types (purchase, added, deleted, updated, liked). Entries can be manually refreshed.
- **Rate Limiting**: Upload endpoint is rate-limited per IP (5/hour) via `express-rate-limit`.
- **Persistent Storage**: Synchronous SQLite via `better-sqlite3`. DB auto-creates and seeds on first run.
- **Endpoint Testing**: Backend API tests with Vitest and Supertest, running against an in-memory SQLite database to keep tests isolated from real data.

## Tech Stack

- **Frontend**: Vite, React, TypeScript, SCSS
- **Backend**: Express.js, TypeScript, ESM
- **Database**: better-sqlite3 (SQLite)
- **Auth**: jsonwebtoken, bcryptjs
- **Email**: Resend API
- **File Uploads**: multer
- **Rate Limiting**: express-rate-limit
- **Testing**: Vitest, Supertest

## Demo Accounts

| Username     | Password                    | Role  | Starting Balance |
| ------------ | --------------------------- | ----- | ---------------- |
| `pixel_pete` | `pete123`                   | user  | $100.00          |
| `sketch_sam` | `sam123`                    | user  | $100.00          |
| `admin`      | _(not shown on login page)_ | admin | $1000.00         |

## API Endpoints

### Auth

- `POST /auth/login` — Login, returns JWT + user object

### Doodles

- `GET /doodles` — Get all doodles
- `GET /doodles/:id` — Get a single doodle
- `POST /doodles` — Upload a new doodle _(auth required)_
- `PATCH /doodles/:id` — Update title, description, price, or image _(owner or admin)_
- `DELETE /doodles/:id` — Delete a doodle and its image file _(owner or admin)_
- `POST /doodles/:id/view` — Increment view count
- `POST /doodles/:id/like` — Increment like count
- `POST /doodles/:id/purchase` — Purchase a doodle, deducts balance, sends email receipt _(auth required)_

### Admin

- `POST /admin/reset` — Reset all doodles to seed + restore all balances _(admin only)_
- `POST /admin/reset-balance/:userId` — Reset a single user's balance _(admin only)_

### Audit Log

- `GET /audit-log` — Get the most recent 100 audit log entries (newest first)

## Getting Started

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/stefanbobrowski/doodle-market.git
cd doodle-market

# 2. Install dependencies (Split Terminal)
cd backend && npm install
cd frontend && npm install

# 3. Configure environment
cp backend/.env.example backend/.env
# Edit if needed — defaults work out of the box

# 4. Start the backend (port 7777)
cd backend && npm run dev

# 5. Start the frontend (port 5173)
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The database is created and seeded automatically on first run.

> **Email**: Purchase confirmation emails require a [Resend](https://resend.com) API key set as `RESEND_API_KEY` in `backend/.env`. Purchases still work without it but the email step is skipped.
