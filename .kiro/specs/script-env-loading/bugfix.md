# Bugfix Requirements Document

## Introduction

Scripts that run outside of Next.js (such as `scripts/update-images.ts` and `src/infrastructure/seeds/seed.ts`) fail to load environment variables from `.env.local`, causing them to crash with "DATABASE_URL environment variable is not set" error. This requires developers to manually wrap script execution with `dotenv-cli`, which is cumbersome and error-prone. The fix should enable scripts to automatically load environment variables from `.env.local` when executed directly with `tsx`.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a script (e.g., `scripts/update-images.ts`) is executed directly with `npx tsx scripts/update-images.ts` THEN the system throws "DATABASE_URL environment variable is not set" error at `src/infrastructure/db/client.ts:6`

1.2 WHEN a script imports `src/infrastructure/db/client.ts` THEN the environment variable check executes before any manual dotenv configuration can load

1.3 WHEN developers need to run scripts THEN they must remember to use `npx dotenv -e .env.local -- tsx <script-path>` wrapper command

### Expected Behavior (Correct)

2.1 WHEN a script is executed directly with `npx tsx scripts/update-images.ts` THEN the system SHALL automatically load environment variables from `.env.local` before the database client initializes

2.2 WHEN `src/infrastructure/db/client.ts` is imported THEN the system SHALL have DATABASE_URL available from `.env.local`

2.3 WHEN developers run scripts THEN they SHALL be able to use simple commands like `npx tsx scripts/update-images.ts` without manual dotenv wrappers

### Unchanged Behavior (Regression Prevention)

3.1 WHEN Next.js pages and API routes import `src/infrastructure/db/client.ts` THEN the system SHALL CONTINUE TO load environment variables correctly through Next.js's built-in .env.local support

3.2 WHEN the application runs in production with environment variables set via hosting platform THEN the system SHALL CONTINUE TO use those environment variables without requiring .env.local

3.3 WHEN DATABASE_URL is not available in any environment variable source THEN the system SHALL CONTINUE TO throw a clear error message

3.4 WHEN scripts run in CI/CD environments with environment variables set via pipeline configuration THEN the system SHALL CONTINUE TO use those environment variables without requiring .env.local
