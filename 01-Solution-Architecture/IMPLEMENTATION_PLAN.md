# Demo1cairolive - Implementation Plan (v2)

## Overview
Platform for showcasing extraordinary Egyptian profiles and articles.
Stack: Next.js 16 + TypeScript + Drizzle ORM + Neon PostgreSQL + NextAuth + Tailwind + GSAP

## Reference Project
`C:\Users\kerol\Claude\Projects\demo1cairolive` - Contains working implementations of:
- i18n (next-intl) with AR/EN + RTL
- Dark/Light mode (ThemeProvider + CSS variables)
- Admin Dashboard (sidebar, stats, CRUD pages, notifications)
- Components (Navbar, ImageUpload, LanguageSwitcher, CommentForm)

Strategy: Adapt reference patterns to our Clean Architecture (Drizzle + DDD).

---

## Phase 1: i18n + Theme + Layout Foundation
**Goal**: البنية التحتية للغات والثيم قبل اي صفحات

### 1.1 Install next-intl
- `npm install next-intl`
- Source: reference `src/i18n.ts`

### 1.2 Create i18n Config
- `src/i18n.ts` - locale config (en, ar), default: ar
- Source: reference `src/i18n.ts`

### 1.3 Create Middleware
- `src/middleware.ts` - locale detection + routing + admin protection
- Locale prefix: always (URLs show /en/ or /ar/)
- Source: reference `src/middleware.ts`

### 1.4 Translation Files
- `src/messages/en.json` - English translations
- `src/messages/ar.json` - Arabic translations
- Keys: nav, hero, home, people, articles, submit, subscribe, admin, common, footer
- Source: reference messages + expand for our entities

### 1.5 Restructure Routes to [locale]
- Move `app/page.tsx` to `app/[locale]/page.tsx`
- Move `app/people/` to `app/[locale]/people/`
- Move `app/articles/` to `app/[locale]/articles/`
- Move `app/submit/` to `app/[locale]/submit/`
- Move `app/subscribe/` to `app/[locale]/subscribe/`
- Move `app/krtk/` to `app/[locale]/krtk/`
- Keep `app/api/` at root (no locale prefix)

### 1.6 Root Layout with Locale
- `app/[locale]/layout.tsx` - dynamic locale, RTL/LTR direction, font switching
- Inter for English, Noto Sans Arabic for Arabic
- `generateStaticParams()` for ['en', 'ar']
- Source: reference `app/[locale]/layout.tsx`

### 1.7 Dark/Light Mode
- `components/ThemeProvider.tsx` - context + localStorage + system preference
- Update `tailwind.config.ts` - `darkMode: 'class'`
- Update `app/globals.css` - CSS variables for light/dark
- Source: reference `ThemeProvider.tsx` + `globals.css`

### 1.8 Update Navbar
- Add LanguageSwitcher component (EN/AR toggle)
- Add Theme toggle (Sun/Moon icon)
- Source: reference `Navbar.tsx` + `LanguageSwitcher.tsx`

### 1.9 Update next.config
- Integrate `withNextIntl()` plugin
- Source: reference `next.config.js`

**Files**:
- NEW: src/i18n.ts, src/middleware.ts, src/messages/en.json, src/messages/ar.json
- NEW: components/ThemeProvider.tsx, components/LanguageSwitcher.tsx
- MOVE: all pages to app/[locale]/
- UPDATE: app/[locale]/layout.tsx, tailwind.config.ts, globals.css, next.config, Header.tsx

---

## Phase 2: Application Layer + API Wiring
**Goal**: كل الـ APIs تشتغل فعليا مع الداتابيز

### 2.1 Application Layer (Use Cases)
Create `src/application/use-cases/`:

| Use Case | Entity | Description |
|----------|--------|-------------|
| ListPeopleUseCase | Person | Pagination + tier filter + search |
| GetPersonByIdUseCase | Person | Single person by UUID |
| CreatePersonUseCase | Person | Admin creates person |
| UpdatePersonUseCase | Person | Admin updates person |
| ListArticlesUseCase | Article | Published articles + pagination |
| GetArticleBySlugUseCase | Article | Single article by slug |
| CreateArticleUseCase | Article | Admin creates article |
| UpdateArticleUseCase | Article | Admin updates article |
| PublishArticleUseCase | Article | Change status to published |
| CreateSubmissionUseCase | Submission | User submits profile |
| ListSubmissionsUseCase | Submission | Admin views queue |
| ReviewSubmissionUseCase | Submission | Approve/reject + convert to person |
| SubscribeUseCase | Subscriber | Newsletter signup |
| UnsubscribeUseCase | Subscriber | Opt out |

### 2.2 Wire API Routes to Use Cases
All 8 existing API routes call use cases instead of returning TODO/501.

### 2.3 Add Admin API Routes
New routes needed for admin dashboard (Phase 3):
- `GET /api/admin/stats` - dashboard statistics
- `POST /api/auth/login` - admin login with rate limiting
- `GET/POST /api/admin/people` - CRUD
- `GET/PUT/DELETE /api/admin/people/[id]`
- `GET/POST /api/admin/articles` - CRUD
- `GET/PUT/DELETE /api/admin/articles/[id]`
- `PATCH /api/admin/submissions/[id]` - approve/reject
- `GET /api/admin/subscribers` - list with export
- `GET /api/admin/notifications` - notification feed
- `POST /api/upload` - image upload (admin only)

### 2.4 Auth Setup
- `lib/auth.ts` - credentials provider (email/password from env)
- Rate limiting: 5 attempts per 15 minutes
- admin_session cookie (httpOnly, 24h expiry)
- Source: reference `api/auth/login/route.ts`

### 2.5 Database Seed Script
`src/infrastructure/seeds/seed.ts`:
- 6 sample persons (bilingual names/bios, mix of tiers and genders)
- 4 sample articles (bilingual titles/content, 2 published, 2 draft)
- 2 subscribers
- Admin user
- Run via `npm run db:seed`
- Source: reference `data/*.json` for sample content structure

**Files**: 14 use case files, 8 API route updates, 10+ new admin API routes, seed.ts, lib/auth.ts

---

## Phase 3: Admin Dashboard
**Goal**: Mohamed يقدر يدير المحتوى بالكامل

### 3.1 Admin Layout
- `app/[locale]/admin/layout.tsx` - sidebar + top header
- Collapsible sidebar with icons (Lucide)
- Navigation: Dashboard, People, Articles, Submissions, Subscribers, Settings
- NotificationBell component with polling
- Mobile responsive (hamburger menu)
- RTL support (sidebar flips for Arabic)
- Source: reference `admin/layout.tsx`

### 3.2 Admin Login
- `app/[locale]/admin/login/page.tsx`
- Email + password form
- Password visibility toggle
- Error messages + loading state
- Source: reference `admin/login/page.tsx`

### 3.3 Admin Dashboard
- `app/[locale]/admin/page.tsx`
- Stats cards: Total People, Total Articles, Pending Submissions, Active Subscribers
- Quick actions: Add Person, New Article, Review Submissions
- Source: reference `admin/page.tsx`

### 3.4 People Management
- `app/[locale]/admin/people/page.tsx` - table with search, tier filter
- `app/[locale]/admin/people/new/page.tsx` - create form (bilingual fields)
- `app/[locale]/admin/people/[id]/edit/page.tsx` - edit form
- Image upload for profile photo
- Verified/Active toggles
- Social links management (dynamic add/remove)
- Source: reference `admin/figures/*`

### 3.5 Articles Management
- `app/[locale]/admin/articles/page.tsx` - table with search
- `app/[locale]/admin/articles/new/page.tsx` - create (bilingual title/content)
- `app/[locale]/admin/articles/[id]/edit/page.tsx` - edit
- Person dropdown (author selection)
- Publish/unpublish toggle
- Source: reference `admin/posts/*`

### 3.6 Submissions Queue
- `app/[locale]/admin/submissions/page.tsx`
- Tab filter: All, Pending, Approved, Rejected (with count badges)
- Card-based layout showing full submission data
- Approve button (converts to person) / Reject button (with notes)
- Source: reference `admin/applications/page.tsx` + `admin/comments/page.tsx` patterns

### 3.7 Subscribers Management
- `app/[locale]/admin/subscribers/page.tsx`
- Table with active/inactive filter
- Export to CSV
- Unsubscribe action

### 3.8 Notifications
- `components/admin/NotificationBell.tsx`
- Dropdown with unread count badge
- Types: new submission, new subscriber, article published
- Mark all read / dismiss individual
- 30-second polling
- Source: reference `admin/NotificationBell.tsx`

### 3.9 Image Upload
- `components/ImageUpload.tsx` - drag and drop
- `POST /api/upload` - save to public/uploads/
- File validation: image types only, max 10MB
- Preview with remove button
- Source: reference `ImageUpload.tsx` + `api/upload/route.ts`

**Files**: 12 admin pages, 5 admin components, admin layout

---

## Phase 4: Frontend Pages
**Goal**: المنصة تبان كاملة بداتا حقيقية للزوار

### 4.1 Home Page Update
- Hero section with bilingual text (from translations)
- Featured people carousel
- Latest articles section
- CTA sections

### 4.2 People Directory (`/[locale]/people`)
- Server component fetching from API
- Grid layout: 1/2/3/4 columns responsive
- Profile cards with photo/gradient avatar, name, title, tier badge, verified icon
- Search bar + tier filter
- Pagination
- Source: reference `figures/page.tsx` card pattern

### 4.3 Person Profile (`/[locale]/people/[slug]`)
- Full profile with all details
- Bio, position, company, social links
- Articles by this person
- Share button
- Source: reference `figures/[slug]/page.tsx`

### 4.4 Articles Listing (`/[locale]/articles`)
- Published articles grid
- Cards: header image, title, author, excerpt, read time, date
- Category filter, sort by date
- Pagination
- Source: reference `posts/page.tsx` (adapt for articles)

### 4.5 Article Detail (`/[locale]/articles/[slug]`)
- Full article content
- Author info card
- Comments section (future)
- Share buttons
- Related articles
- Dynamic OG metadata
- Source: reference `posts/[slug]/page.tsx`

### 4.6 Submit Profile Form
- Connect SubmitProfileForm to POST /api/submissions
- Bilingual labels/placeholders
- Success/error toast
- Redirect after success

### 4.7 Subscribe Form
- Connect SubscribeForm to POST /api/subscribers
- Email validation
- Success message

### 4.8 Footer Update
- Bilingual content
- Social links
- Newsletter signup inline
- Source: reference Footer.tsx pattern

**Files**: 6 page updates/creates, 4 new components, Footer update

---

## Phase 5: Polish + A11y + Performance
**Goal**: Production ready

### 5.1 Accessibility
- Skip navigation link
- aria labels on all interactive elements
- Keyboard navigation
- Color contrast WCAG AA
- Screen reader support
- Focus management on modals

### 5.2 Performance
- Next.js Image optimization everywhere
- Code splitting for admin routes
- Lazy load below-fold components
- prefers-reduced-motion on all GSAP animations
- Skeleton loading states

### 5.3 Error Handling
- Error boundaries per section
- Empty states for lists
- Toast notification system
- 404 and 500 custom pages

### 5.4 SEO
- Dynamic OG tags per page
- Schema.org markup (Article, Person)
- Sitemap generation
- robots.txt

### 5.5 Settings Page
- `app/[locale]/admin/settings/page.tsx`
- Site name (EN/AR), hero text, contact info, social links
- Source: reference `admin/settings/page.tsx`

---

## Phase 6: Stretch Goals (Future)
- Comments on articles with moderation
- Email notifications (SendGrid)
- Google OAuth login
- Full-text search
- Analytics integration
- PWA support

---

## Execution Order

```
Phase 1 (i18n + Theme + Layout)       <- FIRST: Foundation for everything
    |
Phase 2 (Application Layer + APIs)     <- Backend must work before UI
    |
Phase 3 (Admin Dashboard)             <- Admin creates content
    |
Phase 4 (Frontend Pages)              <- Public sees content
    |
Phase 5 (Polish)                      <- Before deploy
    |
Phase 6 (Stretch)                     <- Post-launch
```

## What Changed from v1

| v1 | v2 | Why |
|----|-----|-----|
| i18n was Phase 3 | i18n is Phase 1 | Must restructure routes FIRST, before building pages |
| Dark/Light was not planned | Phase 1 | Reference has it working, easy to add early |
| Admin was Phase 4 | Admin is Phase 3 | Admin creates content that pages display |
| Frontend was Phase 2 | Frontend is Phase 4 | Need admin + content before public pages make sense |
| Build everything from scratch | Adapt from reference | Reference has working patterns for i18n, theme, admin, components |
| No image upload | Phase 3 with admin | Reference has drag-drop ImageUpload ready |
| No notifications | Phase 3 with admin | Reference has NotificationBell with polling |

## Reference Files Map

| Reference File | Adapts To |
|---------------|-----------|
| src/i18n.ts | src/i18n.ts (same) |
| src/middleware.ts | src/middleware.ts (add admin auth) |
| src/messages/*.json | src/messages/*.json (expand keys) |
| app/[locale]/layout.tsx | app/[locale]/layout.tsx (add ThemeProvider) |
| components/ThemeProvider.tsx | components/ThemeProvider.tsx (same) |
| components/Navbar.tsx | components/layout/Header.tsx (merge patterns) |
| components/LanguageSwitcher.tsx | components/LanguageSwitcher.tsx (same) |
| components/ImageUpload.tsx | components/ImageUpload.tsx (same) |
| admin/layout.tsx | app/[locale]/admin/layout.tsx (adapt) |
| admin/page.tsx | app/[locale]/admin/page.tsx (use Drizzle stats) |
| admin/figures/* | app/[locale]/admin/people/* (adapt for Person entity) |
| admin/posts/* | app/[locale]/admin/articles/* (adapt for Article entity) |
| admin/comments/page.tsx | app/[locale]/admin/submissions/page.tsx (tabs pattern) |
| admin/NotificationBell.tsx | components/admin/NotificationBell.tsx (adapt) |
| api/auth/login/route.ts | app/api/auth/login/route.ts (same pattern) |
| api/admin/stats/route.ts | app/api/admin/stats/route.ts (use Drizzle) |
| api/upload/route.ts | app/api/upload/route.ts (same) |
| lib/db.ts | NOT used (we have Drizzle + Clean Architecture) |
| data/*.json | seed.ts (convert to Drizzle seed script) |

---

## Git Checkpoint Rules (Apply to ALL phases)
Every 10 prompts:
1. Code review
2. New branch from master
3. Push to remote
4. Diff review before merge
5. Never force push main
