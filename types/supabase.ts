export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      project_documents: {
        // Renamed from 'documents'
        Row: {
          id: string
          project_name: string // Changed from project_id, type TEXT
          file_name: string // Changed from name/file_name
          file_url: string
          uploaded_at: string // New column, replaces created_at for documents
        }
        Insert: {
          id?: string
          project_name: string
          file_name: string
          file_url: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          project_name?: string
          file_name?: string
          file_url?: string
          uploaded_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description?: string
          location?: string
          start_date?: string
          end_date?: string
          status?: string
          created_at: string
          updated_at?: string
          manager?: string
          budget?: number
          progress?: number
        }
        Insert: {
          id?: string
          name: string
          description?: string
          location?: string
          start_date?: string
          end_date?: string
          status?: string
          created_at?: string
          updated_at?: string
          manager?: string
          budget?: number
          progress?: number
        }
        Update: {
          id?: string
          name?: string
          description?: string
          location?: string
          start_date?: string
          end_date?: string
          status?: string
          created_at?: string
          updated_at?: string
          manager?: string
          budget?: number
          progress?: number
        }
      }
    }
  }
}
