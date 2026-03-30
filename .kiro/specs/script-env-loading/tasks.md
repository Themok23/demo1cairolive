# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Scripts Load Environment Variables Automatically
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases (scripts/update-images.ts, src/infrastructure/seeds/seed.ts)
  - Create test script `test-scripts/test-db-import.ts` that imports client.ts and verifies DATABASE_URL is loaded
  - Test that script execution with `npx tsx test-scripts/test-db-import.ts` successfully loads DATABASE_URL from .env.local
  - Test that existing scripts (scripts/update-images.ts, src/infrastructure/seeds/seed.ts) can import client.ts without errors
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS with "DATABASE_URL environment variable is not set" (this is correct - it proves the bug exists)
  - Document counterexamples found (which scripts fail, at what line, with what error)
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Next.js and Production Environment Loading
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for Next.js contexts (start dev server, test API routes)
  - Observe behavior on UNFIXED code for production-like scenarios (DATABASE_URL set via env var, no .env.local)
  - Write property-based tests capturing observed behavior patterns:
    - Next.js API routes successfully connect to database
    - Production scenarios with platform-provided DATABASE_URL work correctly
    - CI/CD scenarios with pipeline-provided DATABASE_URL work correctly
    - Missing DATABASE_URL throws the same error message
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3. Fix for script environment loading

  - [x] 3.1 Implement conditional dotenv loading in client.ts
    - Add conditional dotenv loading at the very top of src/infrastructure/db/client.ts (before any imports)
    - Detect script context using `!process.env.NEXT_RUNTIME && !process.env.__NEXT_PROCESSED_ENV`
    - Load .env.local using dotenv.config() only in script contexts when file exists
    - Silently continue if dotenv is unavailable or .env.local doesn't exist
    - Keep existing DATABASE_URL check and error message unchanged
    - _Bug_Condition: isBugCondition(input) where input.executionContext == 'standalone-script' AND input.importsModule('src/infrastructure/db/client.ts') AND NOT environmentVariableLoaded('DATABASE_URL') AND fileExists('.env.local')_
    - _Expected_Behavior: For all script executions satisfying bug condition, DATABASE_URL SHALL be loaded from .env.local before the check executes_
    - _Preservation: Next.js contexts, production environments, CI/CD pipelines, and error handling must remain unchanged (Properties 2, 3, 4 from design)_
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4_

  - [x] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Scripts Load Environment Variables Automatically
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify scripts can import client.ts and DATABASE_URL is available
    - Verify scripts run successfully with simple `npx tsx <script-path>` commands
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Next.js and Production Environment Loading
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm Next.js API routes still work correctly
    - Confirm production scenarios still work correctly
    - Confirm error handling still works correctly
    - Confirm all tests still pass after fix (no regressions)

- [-] 4. Checkpoint - Ensure all tests pass
  - Run all tests (bug condition + preservation)
  - Verify scripts work with simple `npx tsx <script-path>` commands
  - Verify Next.js dev server and API routes work correctly
  - Ensure all tests pass, ask the user if questions arise
