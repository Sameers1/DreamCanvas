import { dreams, type Dream, type InsertDream, type User, type InsertUser, users } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Dream methods
  getAllDreams(): Promise<Dream[]>;
  getDream(id: number): Promise<Dream | undefined>;
  createDream(dream: InsertDream): Promise<Dream>;
  updateDreamFavoriteStatus(id: number, isFavorite: boolean): Promise<Dream | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private dreams: Map<number, Dream>;
  private userCurrentId: number;
  private dreamCurrentId: number;

  constructor() {
    this.users = new Map();
    this.dreams = new Map();
    this.userCurrentId = 1;
    this.dreamCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Dream methods
  async getAllDreams(): Promise<Dream[]> {
    return Array.from(this.dreams.values());
  }
  
  async getDream(id: number): Promise<Dream | undefined> {
    return this.dreams.get(id);
  }
  
  async createDream(insertDream: InsertDream): Promise<Dream> {
    const id = this.dreamCurrentId++;
    const createdAt = new Date().toISOString();
    const dream: Dream = { ...insertDream, id, createdAt };
    this.dreams.set(id, dream);
    return dream;
  }
  
  async updateDreamFavoriteStatus(id: number, isFavorite: boolean): Promise<Dream | undefined> {
    const dream = this.dreams.get(id);
    
    if (!dream) {
      return undefined;
    }
    
    const updatedDream: Dream = { ...dream, isFavorite };
    this.dreams.set(id, updatedDream);
    
    return updatedDream;
  }
}

// Import the SupabaseStorage
import { SupabaseStorage } from './supabaseStorage';

// Create an instance of SupabaseStorage or MemStorage based on environment
export const storage = process.env.USE_SUPABASE === 'true' 
  ? new SupabaseStorage() 
  : new MemStorage();
