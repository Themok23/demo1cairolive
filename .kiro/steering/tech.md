# Tech Stack

## Core Framework
- **Next.js 14** (App Router) — server components by default, minimal client state
- **TypeScript 5** — strict mode enabled, full type coverage required
- **React 18**

## Styling & UI
- **Tailwind CSS v3** — utility-first, dark mode primary
- **clsx + tailwind-merge** — for conditional class merging (`cn()` utility)
- **lucide-react** — icons

## Animations
- **GSAP v3 + ScrollTrigger** — scroll animations, page transitions, card reveals
- GSAP must only be used in `'use client'` components — never in server components

## Database & ORM
- **Neon PostgreSQL** (`@neondatabase/serverless`) — serverless HTTP connections
- **Drizzle ORM** — type-safe queries, schema in `src/infrastructure/db/schema.ts`
- Migrations managed via `drizzle-kit`

## Auth
- **NextAuth.js v5** (`next-auth@beta`) — email/password + Google OAuth
- **bcryptjs** — password hashing
- JWT session strategy (serverless-compatible)

## Internationalization
- **next-intl v4** — server-side routing with `/en/` and `/ar/` URL prefixes
- Locales: `['en', 'ar']`, default: `'ar'`
- Translation files: `src/messages/en.json`, `src/messages/ar.json`

## Forms & Validation
- **react-hook-form** — form state management
- **Zod** — runtime schema validation and type inference; used in all API route handlers

## Other Libraries
- **date-fns** — locale-aware date formatting
- **three.js** — 3D canvas effects (client-side only)

## Testing
- **Vitest** — unit and integration tests
- **@vitest/coverage-v8** — coverage reporting
- Target: 80%+ coverage

## Deployment
- **Vercel** — hosting, edge functions, environment variables

---

## Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Tests (single run)
npm run test -- --run

# Test coverage
npm run test:coverage

# Database
npm run db:generate    # generate migration files
npm run db:migrate     # run migrations
npm run db:studio      # open Drizzle Studio
npm run db:seed        # seed database with sample data
```

## Environment Variables

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://...
NEXTAUTH_SECRET=...
GOOGLE_ID=...
GOOGLE_SECRET=...
```
