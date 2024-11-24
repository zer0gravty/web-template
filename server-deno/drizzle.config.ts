import { defineConfig } from 'drizzle-kit';
import env from './src/env.ts';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schemas/*',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
