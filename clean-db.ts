
import { db } from "./db";
import { sql } from "drizzle-orm";

async function cleanDatabase() {
  try {
    // Clean tables
    await db.execute(sql`TRUNCATE TABLE surveys CASCADE`);
    await db.execute(sql`TRUNCATE TABLE posts CASCADE`);
    await db.execute(sql`TRUNCATE TABLE comments CASCADE`);
    await db.execute(sql`TRUNCATE TABLE reactions CASCADE`);
    await db.execute(sql`TRUNCATE TABLE game_scores CASCADE`);
    
    console.log("Database cleaned successfully!");
  } catch (error) {
    console.error("Error cleaning database:", error);
  }
}

cleanDatabase();
