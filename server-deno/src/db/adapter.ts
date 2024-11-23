import { drizzle } from 'drizzle-orm/postgres-js';
import pg from 'pg';
import { z } from 'zod';
import { sessionTable, userTable } from './schemas/auth.ts';

// Use pg driver.
const { Pool } = pg;

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
});

const env = EnvSchema.parse(Deno.env);

// Instantiate Drizzle client with pg driver and schema.
const db = drizzle({
  client: new Pool({
    connectionString: env.DATABASE_URL,
  }),
  schema: {
    user: userTable,
    session: sessionTable,
  },
});

export default db;
