import { Express } from "express";
import { db } from "db";
import { surveys, posts, comments, reactions, game_scores } from "db/schema";
import { sql } from "drizzle-orm";
import { eq, desc } from "drizzle-orm";

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

  // Game routes
  app.post("/api/game/score", async (req, res) => {
    try {
      const { distance, attempts } = req.body;
      const [score] = await db.insert(game_scores)
        .values({
          distance,
          attempts
        })
        .returning();
      res.json(score);
    } catch (error) {
      res.status(500).json({ error: "Failed to save game score" });
    }
  });

  app.get("/api/game/leaderboard", async (req, res) => {
    try {
      const scores = await db
        .select({
          id: sql<number>`id`,
          distance: sql<number>`distance`,
          attempts: sql<number>`attempts`,
          created_at: sql<string>`created_at`
        })
        .from(sql`game_scores`)
        .orderBy(sql`distance`, 'asc')
        .orderBy(sql`attempts`, 'asc')
        .limit(10);

      res.json(scores);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard" });
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

      const [couchSurfingCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(surveys)
        .where(sql`${surveys.needsCouchSurfing} = true`);

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
        couchSurfingRequests: couchSurfingCount.count,
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

      const labeledDistribution = distribution.map(item => ({
        type: getEventTypeLabel(item.type),
        count: item.count
      }));

      res.json(labeledDistribution);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event type analytics" });
    }
  });

  app.get("/api/analytics/current-status", async (req, res) => {
    try {
      const distribution = await db
        .select({
          status: surveys.academicStatus,
          count: sql<number>`count(*)`,
        })
        .from(surveys)
        .groupBy(surveys.academicStatus)
        .orderBy(desc(sql`count(*)`));

      const labeledDistribution = distribution.map(item => ({
        type: getCurrentStatusLabel(item.status),
        count: item.count
      }));

      res.json(labeledDistribution);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch academic status analytics" });
    }
  });

  app.get("/api/analytics/location", async (req, res) => {
    try {
      const distribution = await db
        .select({
          type: surveys.location,
          count: sql<number>`count(*)`,
        })
        .from(surveys)
        .groupBy(surveys.location)
        .orderBy(desc(sql`count(*)`));

      res.json(distribution);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch location analytics" });
    }
  });

  app.get("/api/analytics/alcohol", async (req, res) => {
    try {
      const distribution = await db
        .select({
          type: surveys.alcoholPreferences,
          count: sql<number>`count(*)`,
        })
        .from(surveys)
        .groupBy(surveys.alcoholPreferences)
        .orderBy(desc(sql`count(*)`));

      const labeledDistribution = distribution.map(item => ({
        type: getAlcoholPreferenceLabel(item.type),
        count: item.count
      }));

      res.json(labeledDistribution);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alcohol preferences analytics" });
    }
  });

  app.get("/api/analytics/budget", async (req, res) => {
    try {
      const ranges = [30, 50, 75, 100, 150, 200];
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

// Helper functions to map values to display labels
function getEventTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    networking: "Professional Networking",
    startup: "Seeking Startup Partner(s)",
    dating: "Seeking the Other Half",
    career: "Career Development",
    social: "Social Gathering",
    entertainment: "Entertainment & Fun"
  };
  return labels[type] || type;
}

function getCurrentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    masters: "Master's Candidate",
    phd: "PhD Candidate",
    working: "Working Professional",
    startup: "Founding a Start Up",
    enjoying: "Enjoying Life"
  };
  return labels[status] || status;
}

function getAlcoholPreferenceLabel(preference: string): string {
  const labels: Record<string, string> = {
    none: "No Alcohol",
    beer_wine: "Beer & Wine",
    full_bar: "Full Bar",
    byob: "BYOB"
  };
  return labels[preference] || preference;
}