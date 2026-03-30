# Product: Demo1cairolive (Cairo Live - People Edition)

**Tagline:** Every Egyptian has a story.

A bilingual (English + Arabic) content platform that publishes human-interest articles about Egyptian professionals. Each article features exactly one male and one female Egyptian. Every featured person gets a "Micro KRTK" — a shareable digital business card with its own URL (`/krtk/[slug]`).

## Core Concepts

- **Articles:** Curated posts pairing one male + one female Egyptian, with rich narrative content
- **Micro KRTK:** Free digital business card profile auto-created for every featured person
- **Freemium model:** Platform-created profiles are free (no contact info shown); people can claim and upgrade to premium (contact details, verified badge, analytics)
- **Self-service submissions:** Public form → admin review queue → publish (never auto-publish)
- **Newsletter:** Email subscription system

## User Types

- **Readers:** Browse articles and people directory (no auth required)
- **Featured People:** Can claim and upgrade their profile
- **Submitters:** Self-service profile submission via public form
- **Admins:** Manage articles, people, submissions, subscribers via dashboard

## Key Business Rules

- Every article MUST feature exactly one male and one female person
- Free profiles: contact info is always null/hidden
- Premium profiles: contact info visible, verified badge shown
- Submissions never auto-publish — always go through review queue
- All content must be bilingual (English + Arabic)
