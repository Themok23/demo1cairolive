# Project Structure

## Architecture: Clean Architecture

Strict layer separation. Dependencies only point inward (domain has zero framework deps).

```
src/
├── domain/                  # Pure business logic — NO Next.js, NO Drizzle imports
│   ├── entities/            # Core data types: person.ts, article.ts, submission.ts, subscriber.ts
│   ├── repositories/        # Abstract interfaces (e.g. PersonRepository)
│   └── value-objects/       # gender.ts, tier.ts, articleStatus.ts, submissionStatus.ts
│
├── application/             # Use cases and utilities
│   └── use-cases/           # One class = one action, grouped by entity
│       ├── articles/
│       ├── people/
│       ├── submissions/
│       └── subscribers/
│
├── infrastructure/          # All I/O — DB, external APIs
│   ├── db/
│   │   ├── schema.ts        # Drizzle schema (single source of truth)
│   │   ├── notificationsSchema.ts
│   │   └── client.ts        # Neon DB connection
│   ├── repositories/        # Drizzle implementations of domain interfaces
│   └── seeds/               # Seed scripts
│
├── lib/
│   └── auth.ts              # NextAuth config
│
├── messages/
│   ├── en.json              # English translations
│   └── ar.json              # Arabic translations
│
└── i18n.ts                  # next-intl config (locales: en, ar; default: ar)
```

## Next.js App Router

```
app/
├── [locale]/                # All public/admin pages under locale prefix
│   ├── page.tsx             # Homepage
│   ├── layout.tsx           # Locale layout (next-intl provider)
│   ├── articles/            # /articles and /articles/[slug]
│   ├── people/              # /people and /people/[id]
│   ├── krtk/                # /krtk/[slug] — Micro KRTK profiles
│   ├── submit/              # Self-service submission form
│   ├── subscribe/           # Newsletter signup
│   └── admin/               # Protected admin pages
│       ├── layout.tsx       # Admin layout (auth guard)
│       ├── page.tsx         # Dashboard
│       ├── articles/        # List, new, edit
│       ├── people/          # List, new, edit
│       ├── submissions/     # Review queue
│       └── subscribers/     # Subscriber list
│
└── api/                     # Route handlers (max 20 lines each)
    ├── auth/[...nextauth]/
    ├── articles/
    ├── people/
    ├── submissions/
    ├── subscribers/
    ├── upload/
    └── admin/               # Admin-only variants of above
```

## Components

```
components/
├── admin/                   # Admin UI components
├── animations/              # GSAP wrappers: FadeIn, ParallaxHero, StaggerChildren
├── articles/                # ArticleCard, etc.
├── client/                  # 'use client' components: AnimatedHero, ArticleCarousel, etc.
├── forms/                   # SubmitProfileForm, SubscribeForm
├── layout/                  # Header, Footer, ConditionalLayout
├── micro-krtk/              # KrtkCard, KrtkBusinessCard
└── ui/                      # Primitives: Button, Card, Input, Badge, Skeleton, etc.
```

## Key Conventions

- **Route handlers** live in `app/api/` and must stay under ~20 lines — instantiate use case, call execute, return result
- **Business logic** belongs in `src/application/use-cases/` — never in route handlers or components
- **Repository interfaces** defined in `src/domain/repositories/` — implementations in `src/infrastructure/repositories/`
- **Client components** (`'use client'`) go in `components/client/` or are clearly marked; GSAP only here
- **Path aliases:** `@/*` maps to root, `@/domain/*`, `@/application/*`, `@/infrastructure/*` map to their `src/` counterparts
- **Localized routes** always under `app/[locale]/` — never create pages outside this
- **All user-facing text** must have translations in both `en.json` and `ar.json`
