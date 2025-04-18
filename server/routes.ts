import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { generateDreamSchema, insertDreamSchema } from "@shared/schema";
import { generateImage, extractElementsFromText } from "./huggingface";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all dreams
  app.get("/api/dreams", async (req, res) => {
    try {
      const dreams = await storage.getAllDreams();
      res.json(dreams);
    } catch (error) {
      console.error("Error getting dreams:", error);
      res.status(500).json({ message: "Failed to retrieve dreams" });
    }
  });

  // Get a specific dream by ID
  app.get("/api/dreams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const dream = await storage.getDream(id);
      
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
  app.post("/api/dreams/generate", async (req, res) => {
    try {
      const validatedData = generateDreamSchema.parse(req.body);
      
      // Extract key elements from description for tags
      const elements = await extractElementsFromText(validatedData.description);
      
      // Generate title from description
      const title = elements.length > 0 
        ? `${elements[0].charAt(0).toUpperCase() + elements[0].slice(1)} Dream`
        : "Dream Visualization";
      
      // Generate image using Hugging Face API
      // The style and mood are incorporated in the API implementation
      const prompt = `${validatedData.description}, ${validatedData.style}, ${validatedData.mood}`;
      const imageUrl = await generateImage(prompt);
      
      const generatedDream = {
        title,
        description: validatedData.description,
        imageUrl,
        style: validatedData.style,
        mood: validatedData.mood,
        elements,
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
  app.post("/api/dreams", async (req, res) => {
    try {
      const dreamData = insertDreamSchema.parse(req.body);
      const dream = await storage.createDream(dreamData);
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

  // Toggle favorite status for a dream
  app.patch("/api/dreams/:id/favorite", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isFavorite } = req.body;
      
      if (typeof isFavorite !== 'boolean') {
        return res.status(400).json({ message: "isFavorite must be a boolean" });
      }
      
      const dream = await storage.updateDreamFavoriteStatus(id, isFavorite);
      
      if (!dream) {
        return res.status(404).json({ message: "Dream not found" });
      }
      
      res.json(dream);
    } catch (error) {
      console.error("Error updating favorite status:", error);
      res.status(500).json({ message: "Failed to update favorite status" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
