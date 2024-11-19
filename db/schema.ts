import { pgTable, text, serial, timestamp, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const surveys = pgTable("surveys", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  budget: numeric("budget").notNull(),
  location: text("location").notNull(),
  transportation: text("transportation"),
  needsCouchSurfing: boolean("needs_couch_surfing").default(false),
  eventTypes: text("event_types").array().notNull(),
  venue: text("venue").array().notNull(),
  academicStatus: text("academic_status").notNull(),
  availability: text("availability").array().notNull(),
  dietaryRestrictions: text("dietary_restrictions"),
  alcoholPreferences: text("alcohol_preferences").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: text("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isModerated: boolean("is_moderated").default(false),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: numeric("post_id").notNull(),
  content: text("content").notNull(),
  authorId: text("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  parentId: numeric("parent_id"),
});

export const reactions = pgTable("reactions", {
  id: serial("id").primaryKey(),
  postId: numeric("post_id").notNull(),
  emoji: text("emoji").notNull(),
  authorId: text("author_id").notNull(),
});

export const game_scores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  distance: numeric("distance").notNull(),
  attempts: numeric("attempts").notNull(),
  created_at: timestamp("created_at").defaultNow()
});

const eventTypeEnum = [
  "networking",
  "startup",
  "dating",
  "career",
  "social",
  "entertainment",
] as const;

const venueEnum = [
  "restaurants",
  "pubs",
  "clubs",
  "event_spaces",
  "airbnb",
] as const;

const currentStatusEnum = [
  "masters",
  "phd",
  "working",
  "startup",
  "enjoying",
] as const;

const alcoholPreferencesEnum = [
  "none",
  "beer_wine",
  "full_bar",
  "byob",
] as const;

// Define the time slot schema for both client and server
const timeSlotSchema = z.object({
  date: z.coerce.date(), // Use coerce to handle date string conversion
  times: z.array(z.string())
});

// First define the expected format of the time slot data
interface TimeSlot {
  date: string;
  times: string[];
}

export const insertSurveySchema = createInsertSchema(surveys, {
  budget: z.number().min(30).max(200),
  location: z.string().min(1).max(100),
  transportation: z.string(),
  needsCouchSurfing: z.boolean(),
  eventTypes: z.array(z.enum(eventTypeEnum)).min(1),
  venue: z.array(z.enum(venueEnum)).min(1),
  academicStatus: z.enum(currentStatusEnum),
  availability: z.array(timeSlotSchema).min(1, "Select at least one time slot"),
  dietaryRestrictions: z.string().optional(),
  alcoholPreferences: z.enum(alcoholPreferencesEnum),
});

// Add type for form values
export interface FormValues {
  email: string;
  budget: number;
  location: string;
  transportation?: string;
  needsCouchSurfing: boolean;
  eventTypes: string[];
  venue: string[];
  academicStatus: string;
  availability: TimeSlot[]; // Note: This is the array format in the form
  dietaryRestrictions?: string;
  alcoholPreferences: string;
}

export const selectSurveySchema = createSelectSchema(surveys);
export const insertPostSchema = createInsertSchema(posts);
export const selectPostSchema = createSelectSchema(posts);
export const insertCommentSchema = createInsertSchema(comments);
export const selectCommentSchema = createSelectSchema(comments);
export const insertReactionSchema = createInsertSchema(reactions);
export const selectReactionSchema = createSelectSchema(reactions);

export type Survey = z.infer<typeof insertSurveySchema>;
export type Post = z.infer<typeof selectPostSchema>;
export type Comment = z.infer<typeof selectCommentSchema>;
export type Reaction = z.infer<typeof selectReactionSchema>;