import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as schema from './schema';
import { MemoryDb } from './memory-db';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

export const DATABASE_MODE =
  databaseUrl && databaseUrl.startsWith('postgres') ? 'postgres' : 'memory';

export const isMemoryDb = DATABASE_MODE === 'memory';

// ========================================
// DATABASE
// ========================================
// If DATABASE_URL (Neon/Postgres) is configured we use the real database.
// Otherwise we fall back to an in-memory database so the application can be
// developed, tested and demoed without external infrastructure.
// ========================================
const memoryDb = isMemoryDb ? new MemoryDb() : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db: any = memoryDb ?? drizzle(neon(databaseUrl as string), { schema });

// Reset the in-memory database (used by tests). No-op when using Postgres.
export const resetDatabase = (): void => {
  memoryDb?.reset();
};

export const resetMemoryDb = resetDatabase;

export default db;