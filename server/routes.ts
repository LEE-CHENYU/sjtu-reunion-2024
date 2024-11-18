import { Express } from "express";
import { db } from "db";
import { surveys, posts, comments, reactions } from "db/schema";

export function registerRoutes(app: Express) {
  // Survey routes
  app.post("/api/survey", async (req, res) => {
    try {
      const survey = await db.insert(surveys).values(req.body).returning();
      res.json(survey[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit survey" });
    }
  });

  // Community routes
  app.get("/api/posts", async (req, res) => {
    try {
      const allPosts = await db.select().from(posts).orderBy(posts.createdAt);
      res.json(allPosts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const post = await db.insert(posts).values(req.body).returning();
      res.json(post[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const comment = await db.insert(comments).values(req.body).returning();
      res.json(comment[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  app.post("/api/reactions", async (req, res) => {
    try {
      const reaction = await db.insert(reactions).values(req.body).returning();
      res.json(reaction[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to add reaction" });
    }
  });
}
