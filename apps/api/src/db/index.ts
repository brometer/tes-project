import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// In Vercel, env vars are injected automatically. Locally, load from .env file.
if (!process.env.VERCEL) {
    const dotenv = await import('dotenv');
    const path = await import('path');
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgrespassword@localhost:5432/finance_ai';

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
