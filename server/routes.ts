import express from 'express';
import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { generateDreamSchema, insertDreamSchema } from "@shared/schema";
import { generateImage, extractElementsFromText } from "./huggingface";
import { supabase } from "./supabase";

const router = express.Router();

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    [key: string]: any;
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to verify user authentication
  const requireAuth = async (req: AuthenticatedRequest, res: any, next: any) => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
      res.header('Access-Control-Allow-Credentials', 'true');
      return res.status(200).end();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Authentication failed" });
    }
  };

  // Get all dreams for the authenticated user
  router.get("/api/dreams", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const dreams = await storage.getAllDreams(req.user.id);
      res.json(dreams);
    } catch (error) {
      console.error("Error getting dreams:", error);
      res.status(500).json({ message: "Failed to retrieve dreams" });
    }
  });

  // Get a specific dream by ID (only if it belongs to the authenticated user)
  router.get("/api/dreams/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const id = parseInt(req.params.id);
      const dream = await storage.getDream(id, req.user.id);
      
      if (!dream) {
        return res.status(404).json({ message: "Dream not found" });
      }
      
      res.json(dream);
    } catch (error) {
      console.error("Error getting dream:", error);
      res.status(500).json({ message: "Failed to retrieve dream" });
    }
  });

  // Generate a dream visualization
  router.post("/api/dreams/generate", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const validatedData = generateDreamSchema.parse(req.body);
      
      // Extract key elements from description for tags
      const elements = await extractElementsFromText(validatedData.description);
      
      // Generate title from description
      const title = elements.length > 0 
        ? `${elements[0].charAt(0).toUpperCase() + elements[0].slice(1)} Dream`
        : "Dream Visualization";
      
      // Generate image using Hugging Face API
      const prompt = `${validatedData.description}, ${validatedData.style}, ${validatedData.mood}`;
      const imageUrl = await generateImage(prompt);
      
      const generatedDream = {
        title,
        description: validatedData.description,
        image_url: imageUrl,
        style: validatedData.style,
        mood: validatedData.mood,
        elements,
        user_id: req.user.id,
        is_favorite: false
      };
      
      res.json(generatedDream);
    } catch (error) {
      console.error("Error generating dream:", error);
      res.status(400).json({ 
        message: error instanceof z.ZodError 
          ? error.errors[0]?.message || "Invalid request data" 
          : "Failed to generate dream"
      });
    }
  });

  // Save a dream
  router.post("/api/dreams", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const dreamData = {
        ...req.body,
        user_id: req.user.id
      };
      const validatedData = insertDreamSchema.parse(dreamData);
      const dream = await storage.createDream(validatedData);
      res.status(201).json(dream);
    } catch (error) {
      console.error("Error saving dream:", error);
      res.status(400).json({ 
        message: error instanceof z.ZodError 
          ? error.errors[0]?.message || "Invalid dream data" 
          : "Failed to save dream"
      });
    }
  });

  // Toggle favorite status for a dream (only if it belongs to the authenticated user)
  router.patch("/api/dreams/:id/favorite", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const id = parseInt(req.params.id);
      const { isFavorite } = req.body;
      
      if (typeof isFavorite !== 'boolean') {
        return res.status(400).json({ message: "isFavorite must be a boolean" });
      }
      
      const dream = await storage.updateDreamFavoriteStatus(id, req.user.id, isFavorite);
      
      if (!dream) {
        return res.status(404).json({ message: "Dream not found" });
      }
      
      res.json(dream);
    } catch (error) {
      console.error("Error updating favorite status:", error);
      res.status(500).json({ message: "Failed to update favorite status" });
    }
  });

  // Mount the router
  app.use('/', router);

  // Create and return the HTTP server
  return createServer(app);
}

export { router as routes };
