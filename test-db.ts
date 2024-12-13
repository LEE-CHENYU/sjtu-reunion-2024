
import { db } from "./db";

async function testConnection() {
  try {
    // Test query
    const result = await db.query.posts.findMany();
    console.log("Database connection successful!");
    console.log("Posts:", result);
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

testConnection();
