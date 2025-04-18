import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Custom type for handling Supabase integration
export type StringOrDate = string | Date;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Dream schema for storing dream visualizations
export const dreams = pgTable("dreams", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  style: text("style").notNull(),
  mood: text("mood").notNull(),
  elements: text("elements").array(),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDreamSchema = createInsertSchema(dreams).omit({
  id: true,
  createdAt: true,
});

export const generateDreamSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  style: z.string(),
  mood: z.string(),
});

export type InsertDream = z.infer<typeof insertDreamSchema>;
export type Dream = typeof dreams.$inferSelect;
export type GenerateDreamRequest = z.infer<typeof generateDreamSchema>;
