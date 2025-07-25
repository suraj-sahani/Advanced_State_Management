import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const client = createClient({
  url: 'file:local.db',
});

export const db = drizzle(client, { schema });

// Helper function to generate a unique ID
export function generateId() {
  return crypto.randomUUID();
}
