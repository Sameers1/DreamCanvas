export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      dreams: {
        Row: {
          id: number
          title: string
          description: string
          imageUrl: string
          style: string
          mood: string
          elements: string[]
          isFavorite: boolean
          userId: number | null
          createdAt: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          imageUrl: string
          style: string
          mood: string
          elements: string[]
          isFavorite?: boolean
          userId?: number | null
          createdAt?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          imageUrl?: string
          style?: string
          mood?: string
          elements?: string[]
          isFavorite?: boolean
          userId?: number | null
          createdAt?: string
        }
      }
      users: {
        Row: {
          id: number
          username: string
          email: string
          password: string
          createdAt: string
        }
        Insert: {
          id?: number
          username: string
          email: string
          password: string
          createdAt?: string
        }
        Update: {
          id?: number
          username?: string
          email?: string
          password?: string
          createdAt?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}