import * as dotenv from 'dotenv';
import { config } from '../config/heroku';

dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('Config:', {
  database: {
    url: config.database.url,
    ssl: config.database.ssl
  }
}); 