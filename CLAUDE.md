# CLAUDE.md - Demo1cairolive

## Project Overview
- Client: Cairo Live (Internal/Demo)
- Project Type: Full-Stack Web Application - Egyptian People Profiles & Articles Platform
- Owner: Mohamed Mokhtar - The Mok Company
- Started: 2026-03-27
- Status: In Progress
- Platform: demo1cairolive
- Tagline: "Every Egyptian has a story."

---

## What We Are Building

A sleek, modern platform that publishes articles about notable Egyptian people - always featuring a male and a female per post. Each person mentioned gets a "Micro KRTK" - a shareable digital business card profile with its own unique URL. Think of it as a media/content platform crossed with a professional identity layer.

### Core Concepts

**Articles (Posts)**
- Every article features two Egyptian individuals: one male, one female
- Rich content with photos, narrative, and professional context
- Articles are the discovery layer - they bring people to the platform

**Micro KRTK (Digital Business Cards)**
- Each person mentioned in any article gets a dedicated profile page
- Unique shareable URL: `/krtk/[slug]`
- Contains: name, photo, brief bio, current employer, employment history, certifications, education, notable achievements
- Acts as a free digital business card for every Egyptian featured

**Free vs Premium Tiers**
- Free (Entry Package): All profiles created by the platform are free - basic info pulled from article content
- Premium (Custom): When a person contacts us to claim/upgrade their profile, they can add contact details, custom bio, links, verified badge, and more
- Premium is the monetization path - upsell from free exposure

**Subscription & Self-Service**
- Users can subscribe and submit their own data to be featured
- Submitted profiles go through a review queue before publishing
- This creates a self-sustaining content pipeline

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 |
| Animations | GSAP + ScrollTrigger |
| Backend API | Next.js Route Handlers (clean architecture) |
| Database | Neon (PostgreSQL serverless) via @neondatabase/serverless |
| ORM | Drizzle ORM |
| Auth | NextAuth.js v5 (email/password + Google OAuth) |
| Image hosting | Cloudinary (free tier) or Next.js Image with placeholder |
| Deployment | Vercel |

---

## Architecture

Clean Architecture in Next.js:
- `src/domain/` - Pure business logic, zero framework deps
- `src/application/` - Use cases (one class = one action)
- `src/infrastructure/` - All I/O: DB, external APIs
- `src/presentation/` - Next.js layer: pages, components, API routes

---

## Data Model (Core Entities)

### Person
- id, slug, firstName, firstNameAr, lastName, lastNameAr
- gender (male/female)
- photo, coverPhoto
- bio, bioAr
- currentEmployer, currentTitle
- employmentHistory (JSON array: [{company, title, from, to}])
- certifications (JSON array: [{name, issuer, year}])
- education (JSON array: [{institution, degree, field, year}])
- tier (free/premium)
- contactEmail, contactPhone, website, linkedin, twitter (premium only - null for free)
- isVerified (boolean - premium perk)
- isClaimed (boolean - has the person claimed their profile)
- createdAt, updatedAt

### Article
- id, slug, title, titleAr
- excerpt, excerptAr, content, contentAr
- coverImage
- malePersonId (FK to Person)
- femalePersonId (FK to Person)
- status (draft/published)
- publishedAt, createdAt, updatedAt

### Submission (self-service queue)
- id, email, fullName, gender
- submittedData (JSON - all profile fields)
- status (pending/approved/rejected)
- createdAt, reviewedAt

### Subscriber
- id, email, name
- isActive
- subscribedAt

---

## Design Direction

- Beautiful, interactive, minimal, modern
- Dark mode primary with warm accent colors (gold/amber for Egyptian feel)
- Micro KRTK cards should feel like premium business cards - clean typography, subtle shadows, elegant layout
- GSAP animations for page transitions, card reveals, scroll effects
- Mobile-first responsive design
- Arabic support (RTL) throughout

---

## Identity Override

**Product & Dev mode** - Structured, spec-driven, engineering-minded. Jinx operates as Mohamed's right hand with a dev-first lens on this project.

---

## THE MOK COMPANY STANDARDS

Before doing anything in this project, refer to `context/guidelines.md` in the main workspace for The Mok Company's non-negotiable standards.

Key rules:
- File naming: `[ClientCode]-[DocumentType]-[Version]-[Status].ext`
  Example: `D1CL-CompanyProfile-v2.1-CLIENT-REVIEW.pptx`
- Standard project subfolders: `00-Brief/`, `01-Research/`, `02-Content/`, `03-Design/`, `04-Exports/`, `05-Client-Comms/`, `06-Final/`
- All exports go in `04-Exports/` - never overwrite a version
- Nothing ships without passing `/review`
- Get all client feedback in writing - log it in `05-Client-Comms/`

---

## Key Non-Negotiables

- All business logic lives in `domain/` and `application/` - zero Drizzle or Next.js imports there
- Route handlers are max 20 lines - they instantiate the use case and return the result
- All repository interfaces are in `domain/repositories/` - implementations in `infrastructure/`
- Every article MUST feature exactly one male and one female person
- Free profiles show no contact info - premium only
- Submissions go through review queue - never auto-publish
- GSAP is loaded client-side only (`'use client'` components) - never in server components
- All Egyptian data must use real, accurate information
- Mobile-first responsive design throughout
- Lighthouse score target: Performance 90+, Accessibility 95+
- Bilingual: English + Arabic for all content

---

## Sample Seed Data

### Sample Article 1: "Two Egyptians Shaping the Tech Scene"
- Male: Ahmed Essam (Software Engineer at Microsoft, ex-Google, certified AWS Solutions Architect)
- Female: Nourhan El-Sherif (Product Manager at Vodafone Egypt, ex-Orange, PMP certified)

### Sample Article 2: "From Cairo to the World Stage"
- Male: Karim Abdel-Aziz (Creative Director at Leo Burnett Cairo, ex-TBWA, Cannes Lions winner)
- Female: Mariam Hassan (Data Scientist at IBM Egypt, ex-Amazon, PhD in Machine Learning from AUC)

---

## Available Commands

- `/prime` - Load full company context before starting work
- `/review` - Check any deliverable against The Mok Company standards
- `/spec` - Turn a feature description into a full product spec
- `/ticket` - Break a spec into team tasks
- `/test` - Auto-generate test cases for new code

---

## Key Decisions Made on This Project

- 2026-03-27: Project folder created with full master prompt spec. Clean architecture with Next.js 14, Drizzle ORM, Neon PostgreSQL, NextAuth v5.
- 2026-03-27: Identity mode set to Product & Dev (Jinx + engineering-minded).
- 2026-03-27: Design direction: dark mode primary, gold/amber accents, GSAP animations, premium business card aesthetic for Micro KRTK.

---

## MEMORY SYSTEM

This folder contains a file called MEMORY.md. It is your external memory for this workspace - use it to bridge the gap between sessions.

**At the start of every session:** Read MEMORY.md before responding. Use what you find to inform your work - don't announce it, just be informed by it.

**Memory is user-triggered only.** Do not automatically write to MEMORY.md. Only add entries when the user explicitly asks - using phrases like "remember this," "don't forget," "make a note," "log this," "save this," or "create session notes." When triggered, write the information to MEMORY.md immediately and confirm you've done it.

**All memories are persistent.** Entries stay in MEMORY.md until the user explicitly asks to remove or change them.

**Flag contradictions.** If the user asks you to remember something that conflicts with an existing memory, don't silently overwrite it. Flag the conflict and ask how to reconcile it.
