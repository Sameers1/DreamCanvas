import { dreams, type Dream, type InsertDream, type User, type InsertUser, users } from "@shared/schema";
import { supabase } from "./supabase";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Dream methods
  getAllDreams(userId: string): Promise<Dream[]>;
  getDream(id: number, userId: string): Promise<Dream | undefined>;
  createDream(dream: InsertDream): Promise<Dream>;
  updateDreamFavoriteStatus(id: number, userId: string, isFavorite: boolean): Promise<Dream | undefined>;
}

export class SupabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('username', username)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(insertUser)
      .select()
      .single();
    
    if (error || !data) {
      throw new Error('Failed to create user');
    }
    
    return data as User;
  }
  
  // Dream methods
  async getAllDreams(userId: string): Promise<Dream[]> {
    const { data, error } = await supabase
      .from('dreams')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error('Failed to fetch dreams');
    }
    
    return (data || []) as Dream[];
  }
  
  async getDream(id: number, userId: string): Promise<Dream | undefined> {
    const { data, error } = await supabase
      .from('dreams')
      .select()
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error || !data) return undefined;
    return data as Dream;
  }
  
  async createDream(insertDream: InsertDream): Promise<Dream> {
    const { data, error } = await supabase
      .from('dreams')
      .insert({
        ...insertDream,
        created_at: new Date().toISOString(),
        elements: insertDream.elements || [],
        is_favorite: insertDream.isFavorite !== undefined ? insertDream.isFavorite : false
      })
      .select()
      .single();
    
    if (error || !data) {
      throw new Error('Failed to create dream');
    }
    
    return data as Dream;
  }
  
  async updateDreamFavoriteStatus(id: number, userId: string, isFavorite: boolean): Promise<Dream | undefined> {
    const { data, error } = await supabase
      .from('dreams')
      .update({ is_favorite: isFavorite })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error || !data) return undefined;
    return data as Dream;
  }
}

// Export an instance of SupabaseStorage
export const storage = new SupabaseStorage();
