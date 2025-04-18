import { z } from "zod";

// User schema
export interface User {
  id: string;  // UUID from Supabase auth
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
  user_id: string;  // UUID from Supabase auth
  title: string;
  description: string;
  image_url: string;  // Changed to snake_case to match database
  style: string;
  mood: string;
  elements: string[];
  is_favorite: boolean;  // Changed to snake_case to match database
  created_at: string;  // Changed to snake_case to match database
}

export const insertDreamSchema = z.object({
  user_id: z.string().uuid("User ID must be a valid UUID"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image_url: z.string().url("Image URL must be a valid URL"),  // Changed to snake_case
  style: z.string(),
  mood: z.string(),
  elements: z.array(z.string()).optional(),
  is_favorite: z.boolean().optional(),  // Changed to snake_case
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
