import { z } from "zod";

// User schema
export interface User {
  id: number;
  username: string;
  password: string;
}

export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// Dream schema
export interface Dream {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  style: string;
  mood: string;
  elements: string[];
  isFavorite: boolean;
  createdAt: string;
}

export const insertDreamSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Image URL must be a valid URL"),
  style: z.string(),
  mood: z.string(),
  elements: z.array(z.string()).optional(),
  isFavorite: z.boolean().optional(),
});

export const generateDreamSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  style: z.string(),
  mood: z.string(),
});

export type InsertDream = z.infer<typeof insertDreamSchema>;
export type GenerateDreamRequest = z.infer<typeof generateDreamSchema>;

// Export empty table references for compatibility
export const users = {};
export const dreams = {};
