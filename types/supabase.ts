export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          project_id: string
          project_name?: string
          file_name?: string
          file_path?: string
          file_url?: string
          title?: string
          description?: string
          type?: string
          size?: number
          document_type?: string
          created_at: string
          updated_at?: string
          url?: string
        }
        Insert: {
          id?: string
          project_id?: string
          project_name?: string
          file_name?: string
          file_path?: string
          file_url?: string
          title?: string
          description?: string
          type?: string
          size?: number
          document_type?: string
          created_at?: string
          updated_at?: string
          url?: string
        }
        Update: {
          id?: string
          project_id?: string
          project_name?: string
          file_name?: string
          file_path?: string
          file_url?: string
          title?: string
          description?: string
          type?: string
          size?: number
          document_type?: string
          created_at?: string
          updated_at?: string
          url?: string
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
