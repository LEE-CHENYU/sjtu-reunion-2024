import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env file");
}

// For migrations with SSL configuration for Neon
const migrationClient = postgres(connectionString, { 
  max: 1,
  ssl: {
    require: true,
    rejectUnauthorized: false  // Allow self-signed certificates
  }
});

async function main() {
  console.log("Starting migration...");
  
  try {
    const db = drizzle(migrationClient);
    
    await migrate(db, {
      migrationsFolder: "migrations"
    });
    
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

main(); 