import { supabase } from './supabase';
import { type InsertUser, type User, type InsertDream, type Dream } from '@shared/schema';
import { IStorage } from './storage';

export class SupabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error("Error fetching user:", error);
      return undefined;
    }
    
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !data) {
      console.error("Error fetching user by username:", error);
      return undefined;
    }
    
    return data as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        ...user,
        createdAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error || !data) {
      console.error("Error creating user:", error);
      throw new Error(`Failed to create user: ${error?.message || 'Unknown error'}`);
    }
    
    return data as User;
  }
  
  // Dream methods
  async getAllDreams(): Promise<Dream[]> {
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error("Error fetching all dreams:", error);
      return [];
    }
    
    return (data || []) as Dream[];
  }
  
  async getDream(id: number): Promise<Dream | undefined> {
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error("Error fetching dream:", error);
      return undefined;
    }
    
    return data as Dream;
  }
  
  async createDream(dream: InsertDream): Promise<Dream> {
    const { data, error } = await supabase
      .from('dreams')
      .insert({
        ...dream,
        createdAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error || !data) {
      console.error("Error creating dream:", error);
      throw new Error(`Failed to create dream: ${error?.message || 'Unknown error'}`);
    }
    
    return data as Dream;
  }
  
  async updateDreamFavoriteStatus(id: number, isFavorite: boolean): Promise<Dream | undefined> {
    const { data, error } = await supabase
      .from('dreams')
      .update({ isFavorite })
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) {
      console.error("Error updating dream favorite status:", error);
      return undefined;
    }
    
    return data as Dream;
  }
}