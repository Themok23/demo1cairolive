# Bug Condition Exploration Results

## Test Execution Date
Executed on unfixed code before implementing the fix.

## Bug Summary
Scripts executed with `npx tsx <script-path>` fail to load environment variables from `.env.local`, causing them to crash with "DATABASE_URL environment variable is not set" error at `src/infrastructure/db/client.ts:6`.

## Root Cause Analysis
1. **Module Initialization Timing**: The `if (!process.env.DATABASE_URL)` check at client.ts:5-7 executes during module initialization, which happens immediately when the module is first imported.
2. **No Automatic .env.local Loading**: When scripts are executed with `tsx` or `node`, there is no automatic .env.local loading (unlike Next.js which provides this automatically).
3. **Import-Before-Configure Problem**: Scripts that import client.ts cannot configure dotenv before the import because JavaScript/TypeScript imports are hoisted and processed before any other code.

## Counterexamples Found

### Counterexample 1: test-db-import.ts
**Command**: `npx tsx test-scripts/test-db-import.ts`

**Result**: FAILED ✗

**Error**:
```
DATABASE_URL environment variable is not set
Error occurred at: at <anonymous> (C:\...\src\infrastructure\db\client.ts:6:9)
```

**Details**:
- .env.local exists: ✓
- DATABASE_URL before import: undefined
- Import of client.ts: FAILED
- Error location: client.ts:6 (module initialization)

**Analysis**: The test script confirms that even though .env.local exists with DATABASE_URL defined, the script cannot import client.ts because no automatic environment loading occurs in script contexts.

---

### Counterexample 2: scripts/update-images.ts
**Command**: `npx tsx scripts/update-images.ts`

**Result**: FAILED ✗

**Error**:
```
Error: DATABASE_URL environment variable is not set
    at <anonymous> (C:\...\src\infrastructure\db\client.ts:6:9)
    at Object.<anonymous> (C:\...\src\infrastructure\db\client.ts:10:42)
```

**Details**:
- Script purpose: Update person images in database
- Import statement: `import { db } from '../src/infrastructure/db/client';` (line 5)
- Failure point: Module initialization of client.ts before any script code executes

**Analysis**: This is a real-world script that developers need to run. It fails immediately on import, preventing any database operations.

---

### Counterexample 3: src/infrastructure/seeds/seed.ts
**Command**: `npx tsx src/infrastructure/seeds/seed.ts`

**Result**: FAILED ✗

**Error**:
```
Error: DATABASE_URL environment variable is not set
    at <anonymous> (C:\...\src\infrastructure\db\client.ts:6:9)
    at Object.<anonymous> (C:\...\src\infrastructure\db\client.ts:10:42)
```

**Details**:
- Script purpose: Seed database with sample data
- Import statement: `import { db } from '../db/client';` (line 1)
- Failure point: Module initialization of client.ts before any script code executes

**Analysis**: This is the database seeding script used during development. It's critical for setting up test data but currently requires manual dotenv wrapper.

---

## Workaround Verification

### Test: dotenv-cli wrapper
**Command**: `npx dotenv -e .env.local -- tsx test-scripts/test-db-import.ts`

**Result**: PASSED ✓

**Output**:
```
✓ Successfully imported db/client.ts
✓ Database connection successful
✓ TEST PASSED: Script can import client.ts and DATABASE_URL is loaded from .env.local
```

**Analysis**: The dotenv-cli wrapper successfully loads .env.local BEFORE executing the script, so DATABASE_URL is available when client.ts initializes. This confirms the workaround works but is cumbersome and error-prone.

---

## Bug Condition Formal Specification

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

**Confirmed**: All three test cases satisfy this bug condition:
1. ✓ Execution context is standalone script (tsx)
2. ✓ Script imports client.ts
3. ✓ DATABASE_URL is not loaded (confirmed by test output)
4. ✓ .env.local exists (confirmed by test output)

---

## Expected Behavior After Fix

After implementing the fix, all three scripts should:
1. Successfully import `src/infrastructure/db/client.ts`
2. Automatically load DATABASE_URL from `.env.local`
3. Establish database connection without errors
4. Execute without requiring manual dotenv wrappers

**Test Command**: `npx tsx <script-path>` (simple, no wrapper needed)

---

## Preservation Requirements

The fix must NOT affect:
1. Next.js pages and API routes (they should continue using Next.js's built-in .env.local loading)
2. Production deployments (they should continue using platform environment variables)
3. CI/CD pipelines (they should continue using pipeline environment variables)
4. Error messages when DATABASE_URL is unavailable from all sources

---

## Next Steps

1. ✓ Bug condition exploration complete
2. ✓ Counterexamples documented
3. ✓ Root cause confirmed
4. → Implement fix in `src/infrastructure/db/client.ts`
5. → Re-run all tests to verify fix works
6. → Run preservation tests to ensure no regressions
