import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:local.db',
  },
} satisfies Config;
