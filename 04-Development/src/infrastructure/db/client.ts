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

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
