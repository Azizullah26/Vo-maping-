export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          file_path: string
          file_type: string
          project_id: string | null
          user_id: string | null
          updated_at: string | null
          status: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          file_path: string
          file_type: string
          project_id?: string | null
          user_id?: string | null
          updated_at?: string | null
          status?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          file_path?: string
          file_type?: string
          project_id?: string | null
          user_id?: string | null
          updated_at?: string | null
          status?: string | null
          metadata?: Json | null
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          location: string | null
          status: string
          start_date: string | null
          end_date: string | null
          budget: number | null
          manager_id: string | null
          updated_at: string | null
          coordinates: Json | null
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          location?: string | null
          status?: string
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          manager_id?: string | null
          updated_at?: string | null
          coordinates?: Json | null
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          location?: string | null
          status?: string
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          manager_id?: string | null
          updated_at?: string | null
          coordinates?: Json | null
          image_url?: string | null
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
