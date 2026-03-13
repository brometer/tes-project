import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Only load dotenv locally, Vercel injects env vars automatically
try {
    if (!process.env.VERCEL) {
        require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env') });
    }
} catch (e) {
    // dotenv not available in Vercel serverless, that's fine
}

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgrespassword@localhost:5432/finance_ai';

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
