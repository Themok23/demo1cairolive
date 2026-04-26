@AGENTS.md

# D1CL -- Dev Session Rules

**Project:** Cairo Live (Demo1cairolive) | **Repo:** `The-Mok-Company/Demo1cairolive` | **Dev:** Kerolos Morkos (`Kerolos17`)

---

## PR CREATION -- MANDATORY

**NEVER use `gh pr create` directly.** Always use the script:

```bash
node ~/.claude/scripts/create-pr.js "/c/xampp/htdocs/AI Space/Project folders/Demo1cairolive"
```

This script handles everything automatically:
1. Pushes the branch to origin
2. Creates the PR targeting `staging` (non-interactive, no editor opens)
3. Sends a Slack notification to **#the-mok-company**

If asked to "create a PR", "push and open a PR", "open a PR", or anything similar -- run this script.
No other steps needed. Do not call `gh pr create` directly.

---

## Slack Notification

- Channel: `#the-mok-company`
- Token: `SLACK_PR_BOT_TOKEN` (set as Windows System Environment Variable -- always available)
- Format: Kerolos Morkos as author, matching MOK team format

---

## Git Workflow

```
feat/branch-name -> PR to staging -> 1 approval -> squash merge
```

- Branch naming: `feat/`, `fix/`, `refactor/`, `docs/`, `chore/`
- All PRs target `staging` -- never `main`
- Mohamed handles `staging -> main`
- Never commit directly to `main` or `staging`

---

## Stack

Next.js 14, TypeScript, React, Tailwind CSS v3, GSAP, Neon PostgreSQL (Drizzle ORM), NextAuth v5

---

## Architecture

Clean Architecture -- all paths relative to this folder (`04-Development/`):

| Layer | Path | Rule |
|-------|------|------|
| Domain | `src/domain/` | Pure business logic. Zero framework imports. |
| Application | `src/application/` | Use cases. One class = one action. Returns `{success, data?, error?}`. |
| Infrastructure | `src/infrastructure/` | All I/O: Drizzle repos, DB client, seeds. |
| Presentation | `app/`, `components/`, `lib/` | Next.js pages, components, API routes, helpers. |

**Key rule:** Domain and Application layers must NEVER import from `drizzle-orm`, `next`, or any framework package.

---

## Run Commands

All commands run from `04-Development/`:

```bash
npm install          # install deps
npm run dev          # local dev server
npm run build        # production build
npm run lint         # eslint
npm run test         # vitest
npm run db:push      # push schema to Neon
npm run db:generate  # generate migration file
npm run db:studio    # open Drizzle Studio
npm run db:seed      # seed sample data
```

---

## Vercel

Root Directory in Vercel dashboard must be set to `04-Development`. Otherwise builds will fail.

---

## Reuse Map

When building a new entity layer, copy-adapt from:

| Layer | Pattern source |
|-------|---------------|
| Drizzle table | `src/infrastructure/db/schema.ts` (persons block) |
| Domain entity | `src/domain/entities/person.ts` |
| Repository interface | `src/domain/repositories/personRepository.ts` |
| Drizzle repo | `src/infrastructure/repositories/drizzlePersonRepository.ts` |
| Use cases | `src/application/use-cases/people/*.ts` |
| Admin form | `components/admin/person-form.tsx` |
| Admin list | `components/admin/people-list.tsx` |
| API routes | `app/api/admin/people/route.ts` |
| Bilingual input | `components/ui/BilingualInput.tsx` |
| Image upload | `components/admin/ImageUpload.tsx` |
| Locale helper | `src/lib/locale.ts` (`localized()`) |
| Slug helper | `src/application/utils/slugify.ts` (`safeSlugify()`) |
| API response | `lib/apiResponse.ts` |
| GSAP animations | `components/animations/{FadeIn,ParallaxHero,StaggerChildren}.tsx` |
| Sidebar nav | `components/admin/sidebar.tsx` (append to `navItems`) |
| Notifications | `src/infrastructure/db/notificationsSchema.ts` |
