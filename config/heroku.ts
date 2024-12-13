import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const config = {
  database: {
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  },
  port: process.env.PORT || 5001,
  host: '0.0.0.0'
};
