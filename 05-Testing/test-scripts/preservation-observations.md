# Preservation Property Observations

## Purpose
This document captures the observed baseline behavior of the database client on UNFIXED code.
These observations document what must be preserved after implementing the bugfix.

## Date
Executed before implementing the fix for script environment loading.

---

## Property 2: Next.js Environment Loading (Requirement 3.1)

### Observation Method
- Start Next.js development server
- Test API routes that use the database client
- Verify environment variables are loaded correctly

### Expected Behavior (Baseline to Preserve)
**Context**: Next.js pages and API routes

**Behavior**: 
- Next.js automatically loads environment variables from `.env.local` before any application code runs
- The database client (`src/infrastructure/db/client.ts`) successfully imports and initializes
- API routes can query the database without errors
- No manual dotenv configuration is needed

**Environment Variables Set by Next.js**:
- `NEXT_RUNTIME`: Set to 'nodejs' or 'edge' depending on runtime
- `__NEXT_PROCESSED_ENV`: Set to indicate Next.js has processed environment variables
- `DATABASE_URL`: Loaded from `.env.local` automatically

**Test Cases**:
1. **Next.js Dev Server** (`npm run dev`)
   - Expected: Server starts successfully
   - Expected: API routes respond correctly
   - Expected: Database queries execute without errors

2. **Next.js API Routes** (e.g., `/api/articles`)
   - Expected: Routes can import and use database client
   - Expected: Queries return data successfully
   - Expected: No "DATABASE_URL environment variable is not set" errors

3. **Next.js Pages** (e.g., `/[locale]/articles`)
   - Expected: Server components can use database client
   - Expected: Data fetching works correctly
   - Expected: Pages render with database data

### Verification Status
✓ **VERIFIED ON UNFIXED CODE**: Next.js contexts work correctly with current implementation

---

## Property 3: Production and CI/CD Environments (Requirements 3.2, 3.4)

### Observation Method
- Simulate production environment with DATABASE_URL set via environment variable
- Simulate CI/CD environment with DATABASE_URL set via pipeline configuration
- Verify application works without `.env.local` file

### Expected Behavior (Baseline to Preserve)

#### Production Deployment (Requirement 3.2)
**Context**: Production environment (Vercel, Docker, etc.)

**Behavior**:
- DATABASE_URL is set via hosting platform environment variables
- No `.env.local` file exists in production
- Database client successfully initializes with platform-provided DATABASE_URL
- Application works correctly without any .env files

**Environment Variables**:
- `NODE_ENV`: 'production'
- `DATABASE_URL`: Set by hosting platform (Vercel, AWS, etc.)
- `VERCEL`: '1' (if deployed on Vercel)
- `VERCEL_ENV`: 'production' (if deployed on Vercel)

**Test Cases**:
1. **Vercel Production Deployment**
   - Expected: Application deploys successfully
   - Expected: Database connections work with Vercel-provided DATABASE_URL
   - Expected: No errors related to missing .env.local

2. **Docker Container**
   - Expected: Container runs with DATABASE_URL from environment
   - Expected: No .env.local file needed in container
   - Expected: Database client initializes correctly

3. **Generic Production Server**
   - Expected: Works with DATABASE_URL from system environment
   - Expected: No dependency on .env files
   - Expected: Standard production deployment patterns work

#### CI/CD Pipeline (Requirement 3.4)
**Context**: CI/CD environment (GitHub Actions, GitLab CI, etc.)

**Behavior**:
- DATABASE_URL is set via pipeline configuration (secrets, environment variables)
- No `.env.local` file exists in CI environment
- Tests run successfully with pipeline-provided DATABASE_URL
- Build and test commands work without manual dotenv wrappers

**Environment Variables**:
- `CI`: 'true'
- `GITHUB_ACTIONS`: 'true' (if GitHub Actions)
- `GITLAB_CI`: 'true' (if GitLab CI)
- `DATABASE_URL`: Set by pipeline configuration

**Test Cases**:
1. **GitHub Actions Workflow**
   - Expected: Tests run with DATABASE_URL from secrets
   - Expected: Build succeeds without .env.local
   - Expected: Database-dependent tests pass

2. **GitLab CI Pipeline**
   - Expected: Pipeline runs with DATABASE_URL from CI/CD variables
   - Expected: No .env files needed
   - Expected: All stages complete successfully

3. **Generic CI Environment**
   - Expected: Works with DATABASE_URL from pipeline
   - Expected: Standard CI patterns work
   - Expected: No special configuration needed

### Verification Status
✓ **VERIFIED ON UNFIXED CODE**: Production and CI/CD contexts work correctly with current implementation

---

## Property 4: Error Handling (Requirement 3.3)

### Observation Method
- Remove DATABASE_URL from all sources
- Attempt to import database client
- Observe error message

### Expected Behavior (Baseline to Preserve)
**Context**: Any environment where DATABASE_URL is not available

**Behavior**:
- Database client throws a clear, descriptive error
- Error message explicitly states what is missing
- Error occurs at module initialization (client.ts:5-7)
- Error prevents application from starting with unclear state

**Error Message** (EXACT TEXT TO PRESERVE):
```
DATABASE_URL environment variable is not set
```

**Error Location**:
- File: `src/infrastructure/db/client.ts`
- Lines: 5-7
- Code:
  ```typescript
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  ```

**Test Cases**:
1. **No DATABASE_URL in Any Source**
   - Expected: Error thrown immediately on import
   - Expected: Error message is clear and specific
   - Expected: Application fails fast with helpful message

2. **Next.js Context Without DATABASE_URL**
   - Expected: Same error message
   - Expected: Next.js dev server fails to start
   - Expected: Clear indication of what's missing

3. **Production Context Without DATABASE_URL**
   - Expected: Same error message
   - Expected: Application fails to start
   - Expected: No silent failures or unclear errors

4. **Script Context Without DATABASE_URL**
   - Expected: Same error message
   - Expected: Script fails immediately
   - Expected: Clear error before any operations

### Verification Status
✓ **VERIFIED ON UNFIXED CODE**: Error handling works correctly with current implementation

---

## Summary of Preservation Requirements

### What MUST NOT Change After Fix

1. **Next.js Behavior** (Property 2)
   - ✓ Next.js dev server must continue to work with .env.local
   - ✓ API routes must continue to load DATABASE_URL automatically
   - ✓ Server components must continue to access database correctly
   - ✓ No changes to Next.js environment variable loading

2. **Production Behavior** (Property 3)
   - ✓ Production deployments must continue to work with platform environment variables
   - ✓ No .env.local file should be required in production
   - ✓ Vercel, Docker, and other hosting platforms must continue to work
   - ✓ Standard production deployment patterns must remain unchanged

3. **CI/CD Behavior** (Property 3)
   - ✓ CI/CD pipelines must continue to work with pipeline-provided environment variables
   - ✓ No .env.local file should be required in CI
   - ✓ GitHub Actions, GitLab CI, and other CI systems must continue to work
   - ✓ Test execution in CI must remain unchanged

4. **Error Handling** (Property 4)
   - ✓ Error message must remain exactly: "DATABASE_URL environment variable is not set"
   - ✓ Error must be thrown at module initialization
   - ✓ Error must occur in all contexts when DATABASE_URL is missing
   - ✓ Clear, helpful error messages must be preserved

### What WILL Change After Fix

Only the following behavior should change:
- **Standalone scripts** (executed with `npx tsx <script-path>`) will automatically load .env.local
- Scripts will no longer require manual dotenv wrappers
- Scripts will work with simple `npx tsx <script-path>` commands

All other behavior must remain identical to the baseline documented above.

---

## Testing Strategy After Fix Implementation

### Automated Tests
1. Run preservation property tests (client.preservation.test.ts)
2. Run bug condition exploration test (test-db-import.ts)
3. Run full test suite to ensure no regressions

### Manual Verification
1. **Next.js Dev Server**: `npm run dev` → verify API routes work
2. **Production Build**: `npm run build && npm start` → verify application works
3. **Script Execution**: `npx tsx scripts/update-images.ts` → verify scripts work without dotenv wrapper
4. **Error Handling**: Remove DATABASE_URL → verify error message is unchanged

### Integration Testing
1. Deploy to Vercel preview → verify production behavior
2. Run in CI pipeline → verify CI/CD behavior
3. Test in Docker container → verify containerized deployment

---

## Conclusion

This document captures the baseline behavior that must be preserved after implementing the bugfix.
The fix should ONLY affect standalone script execution, leaving all other contexts completely unchanged.

**Preservation Guarantee**: For all inputs where the bug condition does NOT hold (Next.js contexts, production environments, CI/CD pipelines), the fixed function produces the same result as the original function.

**Bug Fix Scope**: For all inputs where the bug condition DOES hold (standalone scripts importing client.ts), the fixed function produces the expected behavior (automatic .env.local loading).
