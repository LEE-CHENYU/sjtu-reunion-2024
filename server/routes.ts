import { Express } from "express";
import { db } from "db";
import { surveys, posts, comments, reactions } from "db/schema";
import { sql } from "drizzle-orm";
import { eq, desc, count } from "drizzle-orm";

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

  // Analytics routes
  app.get("/api/analytics/summary", async (req, res) => {
    try {
      const [totalResponses] = await db
        .select({ count: sql<number>`count(*)` })
        .from(surveys);

      const [avgBudget] = await db
        .select({ average: sql<number>`avg(${surveys.budget})` })
        .from(surveys);

      const popularEventTypes = await db
        .select({
          type: sql<string>`unnest(${surveys.eventTypes})`,
          count: sql<number>`count(*)`,
        })
        .from(surveys)
        .groupBy(sql`unnest(${surveys.eventTypes})`)
        .orderBy(desc(sql`count(*)`))
        .limit(3);

      res.json({
        totalResponses: totalResponses.count,
        averageBudget: Math.round(avgBudget.average || 0),
        popularEventTypes,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics summary" });
    }
  });

  app.get("/api/analytics/event-types", async (req, res) => {
    try {
      const distribution = await db
        .select({
          type: sql<string>`unnest(${surveys.eventTypes})`,
          count: sql<number>`count(*)`,
        })
        .from(surveys)
        .groupBy(sql`unnest(${surveys.eventTypes})`)
        .orderBy(desc(sql`count(*)`));

      res.json(distribution);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event type analytics" });
    }
  });

  app.get("/api/analytics/venues", async (req, res) => {
    try {
      const distribution = await db
        .select({
          venue: sql<string>`unnest(${surveys.venue})`,
          count: sql<number>`count(*)`,
        })
        .from(surveys)
        .groupBy(sql`unnest(${surveys.venue})`)
        .orderBy(desc(sql`count(*)`));

      res.json(distribution);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch venue analytics" });
    }
  });

  app.get("/api/analytics/budget", async (req, res) => {
    try {
      const ranges = [0, 100, 500, 1000, 5000, 10000];
      const distribution = await Promise.all(
        ranges.slice(0, -1).map(async (min, index) => {
          const max = ranges[index + 1];
          const [result] = await db
            .select({ count: sql<number>`count(*)` })
            .from(surveys)
            .where(sql`${surveys.budget} >= ${min} AND ${surveys.budget} < ${max}`);
          
          return {
            range: `$${min}-${max}`,
            count: Number(result.count),
          };
        })
      );

      res.json(distribution);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch budget analytics" });
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
