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
      entities: {
        Row: {
          id: string
          slug: string
          name: string
          accent_color: string
          description: string | null
          google_sheet_id: string
          ein: string | null
          primary_bank_name: string | null
          primary_bank_contact: string | null
          primary_bank_phone: string | null
          secondary_bank_name: string | null
          secondary_bank_contact: string | null
          secondary_bank_phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['entities']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['entities']['Insert']>
      }
      properties: {
        Row: {
          id: string
          entity_id: string
          address: string
          city: string | null
          state: string | null
          zip_code: string | null
          property_type: string | null
          bedrooms: number | null
          bathrooms: number | null
          square_footage: number | null
          purchase_price: number | null
          purchase_date: string | null
          current_estimated_value: number | null
          is_occupied: boolean
          is_listed: boolean
          is_archived: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['properties']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['properties']['Insert']>
      }
      documents: {
        Row: {
          id: string
          property_id: string | null
          entity_id: string
          file_name: string
          file_type: string
          file_size: number
          gcs_path: string
          document_type: string
          document_date: string | null
          description: string | null
          tags: string[] | null
          uploaded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['documents']['Insert']>
      }
      // Add other table types as needed
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
