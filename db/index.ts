import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from '../config/heroku';

const client = postgres(config.database.url!, {
  ssl: config.database.ssl
});

export const db = drizzle(client);
