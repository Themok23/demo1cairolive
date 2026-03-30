/**
 * Bug Condition Exploration Test
 * 
 * This test verifies that scripts can import src/infrastructure/db/client.ts
 * and have DATABASE_URL automatically loaded from .env.local
 * 
 * EXPECTED BEHAVIOR (after fix):
 * - Script should successfully import client.ts
 * - DATABASE_URL should be loaded from .env.local
 * - Database connection should be established
 * 
 * CURRENT BEHAVIOR (unfixed code):
 * - Script fails with "DATABASE_URL environment variable is not set"
 * - Error occurs at client.ts:5-7 during module initialization
 * - This happens BEFORE any script code can run
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3**
 */

console.log('Starting bug condition exploration test...\n');

console.log('Step 1: Checking if .env.local exists');
const fs = require('fs');
const path = require('path');
const envPath = path.resolve(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);
console.log(`  .env.local exists: ${envExists}`);

if (!envExists) {
  console.error('ERROR: .env.local file not found. Cannot proceed with test.');
  process.exit(1);
}

console.log('\nStep 2: Checking DATABASE_URL before import');
console.log(`  DATABASE_URL is set: ${!!process.env.DATABASE_URL}`);
console.log(`  DATABASE_URL value: ${process.env.DATABASE_URL ? '[REDACTED]' : 'undefined'}`);

console.log('\nStep 3: Attempting to import db/client.ts');
console.log('  This will trigger module initialization and the DATABASE_URL check...');

try {
  // This import will fail on unfixed code because:
  // 1. Module initialization happens immediately
  // 2. client.ts checks for DATABASE_URL at lines 5-7
  // 3. No .env.local loading has occurred yet
  // 4. The check fails and throws an error
  const { db } = require('../src/infrastructure/db/client');
  
  console.log('  ✓ Successfully imported db/client.ts');
  console.log('\nStep 4: Verifying DATABASE_URL is now available');
  console.log(`  DATABASE_URL is set: ${!!process.env.DATABASE_URL}`);
  
  console.log('\nStep 5: Testing database connection');
  // Simple query to verify connection works
  db.execute('SELECT 1 as test').then(() => {
    console.log('  ✓ Database connection successful');
    console.log('\n✓ TEST PASSED: Script can import client.ts and DATABASE_URL is loaded from .env.local');
    process.exit(0);
  }).catch((error: Error) => {
    console.error('  ✗ Database connection failed:', error.message);
    console.error('\n✗ TEST FAILED: Database connection error');
    process.exit(1);
  });
  
} catch (error: any) {
  console.error('  ✗ Failed to import db/client.ts');
  console.error(`  Error: ${error.message}`);
  console.error(`  Error occurred at: ${error.stack?.split('\n')[1]?.trim() || 'unknown'}`);
  
  console.log('\n--- COUNTEREXAMPLE FOUND ---');
  console.log('Bug Condition: Script imports client.ts before DATABASE_URL is loaded');
  console.log('Expected: DATABASE_URL should be automatically loaded from .env.local');
  console.log('Actual: DATABASE_URL is not loaded, causing module initialization to fail');
  console.log('Root Cause: No automatic .env.local loading in script context');
  console.log('----------------------------\n');
  
  console.error('✗ TEST FAILED: Cannot import client.ts - DATABASE_URL not loaded from .env.local');
  process.exit(1);
}
