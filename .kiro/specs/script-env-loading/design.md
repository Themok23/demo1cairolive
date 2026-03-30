# Script Environment Loading Bugfix Design

## Overview

Scripts executed outside of Next.js (such as `scripts/update-images.ts` and `src/infrastructure/seeds/seed.ts`) fail because `src/infrastructure/db/client.ts` checks for `DATABASE_URL` at module initialization time, before any script code can load environment variables from `.env.local`. The fix will add automatic dotenv loading at the top of `client.ts` that only executes in non-Next.js contexts, ensuring environment variables are available before the DATABASE_URL check runs. This approach preserves Next.js's built-in .env.local loading while enabling scripts to work without manual dotenv wrappers.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when a script imports db/client.ts before environment variables are loaded
- **Property (P)**: The desired behavior - DATABASE_URL should be available from .env.local when client.ts initializes
- **Preservation**: Next.js app behavior, production environment variables, and CI/CD pipeline configurations must remain unchanged
- **Module Initialization Time**: The moment when a TypeScript/JavaScript module is first imported and its top-level code executes
- **Next.js Context**: Code running within Next.js's runtime (pages, API routes, middleware) where Next.js automatically loads .env.local
- **Script Context**: Code running via direct execution (tsx, node) outside Next.js's runtime where .env.local is not automatically loaded
- **process.env.NODE_ENV**: Environment variable that indicates the runtime environment (development, production, test)

## Bug Details

### Bug Condition

The bug manifests when a standalone script (executed with `npx tsx <script-path>`) imports `src/infrastructure/db/client.ts`. The database client module checks for `DATABASE_URL` at lines 5-7 during module initialization, which happens immediately when the module is imported. At this point, no script code has executed yet, so any manual dotenv configuration in the script itself comes too late. The environment variable check fails before the script can load .env.local.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type ScriptExecution
  OUTPUT: boolean
  
  RETURN input.executionContext == 'standalone-script'
         AND input.importsModule('src/infrastructure/db/client.ts')
         AND NOT environmentVariableLoaded('DATABASE_URL')
         AND fileExists('.env.local')
END FUNCTION
```

### Examples

- **Example 1**: Running `npx tsx scripts/update-images.ts` throws "DATABASE_URL environment variable is not set" at client.ts:6, even though .env.local exists with DATABASE_URL defined
- **Example 2**: Running `npx tsx src/infrastructure/seeds/seed.ts` (via `npm run db:seed`) throws the same error at client.ts:6
- **Example 3**: Running `npx dotenv -e .env.local -- tsx scripts/update-images.ts` works because dotenv-cli loads .env.local before executing the script
- **Edge Case**: Running scripts in CI/CD with DATABASE_URL set via pipeline configuration should continue to work without requiring .env.local

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Next.js pages and API routes must continue to load environment variables through Next.js's built-in .env.local support
- Production deployments with environment variables set via hosting platform (Vercel) must continue to work without .env.local
- CI/CD pipelines with environment variables set via pipeline configuration must continue to work without .env.local
- The clear error message when DATABASE_URL is unavailable from any source must continue to be thrown

**Scope:**
All contexts that do NOT involve standalone script execution should be completely unaffected by this fix. This includes:
- Next.js development server (`npm run dev`)
- Next.js production builds and runtime (`npm run build`, `npm start`)
- API route handlers in `app/api/**`
- Server components and pages in `app/[locale]/**`
- Production deployments on Vercel or other hosting platforms
- CI/CD test and build pipelines

## Hypothesized Root Cause

Based on the bug description and code analysis, the root cause is:

1. **Module Initialization Timing**: The `if (!process.env.DATABASE_URL)` check at client.ts:5-7 executes during module initialization, which happens immediately when the module is first imported. This is before any script code can run.

2. **No Automatic .env.local Loading in Scripts**: When scripts are executed with `tsx` or `node`, there is no automatic .env.local loading. Next.js provides this automatically for its own runtime, but standalone scripts run outside Next.js's context.

3. **Import-Before-Configure Problem**: Scripts that import client.ts cannot configure dotenv before the import because JavaScript/TypeScript imports are hoisted and processed before any other code in the file.

4. **Current Workaround is Manual**: The only current solution is wrapping script execution with `dotenv-cli`, which loads .env.local before executing the script: `npx dotenv -e .env.local -- tsx <script-path>`

## Correctness Properties

Property 1: Bug Condition - Scripts Load Environment Variables Automatically

_For any_ script execution where the script imports `src/infrastructure/db/client.ts` and a `.env.local` file exists with `DATABASE_URL` defined, the fixed client.ts SHALL automatically load environment variables from `.env.local` before the DATABASE_URL check executes, allowing the script to run successfully without manual dotenv wrappers.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - Next.js Environment Loading

_For any_ code execution within Next.js's runtime context (pages, API routes, server components), the fixed client.ts SHALL NOT interfere with Next.js's built-in .env.local loading mechanism, preserving the existing behavior where Next.js automatically loads environment variables before any application code runs.

**Validates: Requirements 3.1**

Property 3: Preservation - Production and CI/CD Environments

_For any_ execution in production or CI/CD environments where DATABASE_URL is set via hosting platform or pipeline configuration (and .env.local does not exist), the fixed client.ts SHALL use the environment variable from the platform without requiring .env.local, preserving the existing deployment behavior.

**Validates: Requirements 3.2, 3.4**

Property 4: Preservation - Error Handling

_For any_ execution where DATABASE_URL is not available from any source (.env.local, platform environment variables, or pipeline configuration), the fixed client.ts SHALL throw the same clear error message as the original code, preserving the existing error handling behavior.

**Validates: Requirements 3.3**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `src/infrastructure/db/client.ts`

**Function**: Module-level initialization code (top of file)

**Specific Changes**:

1. **Add Conditional Dotenv Loading**: Insert code at the very top of client.ts (before any other imports or code) that detects whether we're running in a script context and loads .env.local if needed

2. **Detection Strategy**: Use `process.env.NEXT_RUNTIME` or similar Next.js-specific environment variables to detect if we're running in Next.js context. If not present, we're in a script context.

3. **Conditional Import**: Only import and execute dotenv if we're in a script context and .env.local exists

4. **Preserve Existing Check**: Keep the existing `if (!process.env.DATABASE_URL)` check unchanged, as it provides clear error messages

5. **No Changes to Scripts**: Scripts should not need any modifications - they should work with simple `npx tsx <script-path>` commands

**Pseudocode for Fix**:
```typescript
// At the very top of src/infrastructure/db/client.ts

// Detect if we're running outside Next.js (script context)
if (!process.env.NEXT_RUNTIME && !process.env.__NEXT_PROCESSED_ENV) {
  // We're in a script context - try to load .env.local
  try {
    const { config } = require('dotenv');
    const { existsSync } = require('fs');
    const { resolve } = require('path');
    
    const envPath = resolve(process.cwd(), '.env.local');
    if (existsSync(envPath)) {
      config({ path: envPath });
    }
  } catch (error) {
    // Silently fail - if dotenv isn't available or .env.local doesn't exist,
    // we'll rely on environment variables being set another way
  }
}

// Existing imports and code continue unchanged
import { drizzle } from 'drizzle-orm/neon-http';
// ... rest of file
```

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Create a minimal test script that imports client.ts and attempts to use the database connection. Run this script with `npx tsx` on the UNFIXED code to observe the failure. Verify that the error occurs at client.ts:6 during module initialization, before any script code executes.

**Test Cases**:
1. **Basic Script Import Test**: Create `test-scripts/test-import.ts` that imports client.ts and logs success (will fail on unfixed code with "DATABASE_URL environment variable is not set")
2. **Existing Script Test**: Run `npx tsx scripts/update-images.ts` without dotenv-cli wrapper (will fail on unfixed code)
3. **Seed Script Test**: Run `npm run db:seed` which executes `tsx src/infrastructure/seeds/seed.ts` (will fail on unfixed code)
4. **Manual Dotenv Test**: Run `npx dotenv -e .env.local -- tsx scripts/update-images.ts` (should succeed even on unfixed code, confirming workaround)

**Expected Counterexamples**:
- Scripts fail with "DATABASE_URL environment variable is not set" error
- Error occurs at client.ts:6 during module initialization
- Possible causes: no automatic .env.local loading, module initialization timing, import hoisting

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL scriptExecution WHERE isBugCondition(scriptExecution) DO
  result := executeScript_fixed(scriptExecution)
  ASSERT result.success == true
  ASSERT result.databaseConnectionEstablished == true
  ASSERT NOT result.error.contains("DATABASE_URL environment variable is not set")
END FOR
```

**Test Plan**: After implementing the fix, run all scripts that previously failed and verify they now succeed without manual dotenv wrappers.

**Test Cases**:
1. **Update Images Script**: Run `npx tsx scripts/update-images.ts` and verify it connects to database successfully
2. **Seed Script**: Run `npm run db:seed` and verify it executes without errors
3. **Custom Test Script**: Run `test-scripts/test-import.ts` and verify it imports client.ts successfully
4. **.env.local Variations**: Test with different .env.local configurations (DATABASE_URL present, DATABASE_URL missing, file missing entirely)

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL execution WHERE NOT isBugCondition(execution) DO
  ASSERT behavior_original(execution) == behavior_fixed(execution)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for Next.js contexts and production scenarios, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Next.js Development Server**: Start `npm run dev` and verify pages and API routes work correctly (test on both unfixed and fixed code)
2. **Next.js API Routes**: Make requests to API endpoints that use database client and verify responses are identical
3. **Production Build**: Run `npm run build` and `npm start`, verify application works correctly
4. **CI/CD Simulation**: Set DATABASE_URL via environment variable (without .env.local), run scripts, verify they work
5. **Missing DATABASE_URL**: Remove DATABASE_URL from all sources, verify error message is identical to unfixed code

### Unit Tests

- Test that dotenv loading only executes in script contexts (not in Next.js contexts)
- Test that .env.local is loaded when it exists in script contexts
- Test that execution continues normally when .env.local doesn't exist
- Test that DATABASE_URL check still throws clear error when variable is unavailable from all sources
- Test that Next.js environment variable detection works correctly

### Property-Based Tests

- Generate random execution contexts (Next.js vs script) and verify correct dotenv loading behavior
- Generate random .env.local configurations and verify DATABASE_URL is loaded correctly
- Generate random environment variable scenarios and verify preservation of existing behavior
- Test that all Next.js runtime contexts continue to work identically to unfixed code

### Integration Tests

- Test full script execution flow: import client.ts → load .env.local → establish database connection → execute queries
- Test Next.js development and production flows remain unchanged
- Test deployment scenarios with various environment variable configurations
- Test error scenarios produce identical error messages to unfixed code
