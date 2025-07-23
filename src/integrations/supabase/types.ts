export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          created_at: string
          customer_id: string
          end_time: string
          id: string
          notes: string | null
          pet_id: string
          petshop_id: string
          price: number
          service_id: string
          start_time: string
          status: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          created_at?: string
          customer_id: string
          end_time: string
          id?: string
          notes?: string | null
          pet_id: string
          petshop_id: string
          price: number
          service_id: string
          start_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          created_at?: string
          customer_id?: string
          end_time?: string
          id?: string
          notes?: string | null
          pet_id?: string
          petshop_id?: string
          price?: number
          service_id?: string
          start_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_petshop_id_fkey"
            columns: ["petshop_id"]
            isOneToOne: false
            referencedRelation: "petshops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          petshop_id: string
          phone: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          petshop_id: string
          phone: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          petshop_id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_petshop_id_fkey"
            columns: ["petshop_id"]
            isOneToOne: false
            referencedRelation: "petshops"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          age: number
          breed: string
          coat_type: string | null
          created_at: string
          customer_id: string
          id: string
          name: string
          notes: string | null
          photo_url: string | null
          size: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          age: number
          breed: string
          coat_type?: string | null
          created_at?: string
          customer_id: string
          id?: string
          name: string
          notes?: string | null
          photo_url?: string | null
          size: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          age?: number
          breed?: string
          coat_type?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          name?: string
          notes?: string | null
          photo_url?: string | null
          size?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      petshops: {
        Row: {
          active: boolean | null
          address: string
          created_at: string
          email: string
          id: string
          logo_url: string | null
          max_appointments: number | null
          monthly_appointments: number | null
          name: string
          owner_id: string
          phone: string
          plan: string
          primary_color: string | null
          secondary_color: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          address: string
          created_at?: string
          email: string
          id?: string
          logo_url?: string | null
          max_appointments?: number | null
          monthly_appointments?: number | null
          name: string
          owner_id: string
          phone: string
          plan?: string
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          address?: string
          created_at?: string
          email?: string
          id?: string
          logo_url?: string | null
          max_appointments?: number | null
          monthly_appointments?: number | null
          name?: string
          owner_id?: string
          phone?: string
          plan?: string
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "petshops_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          barcode: string | null
          brand: string | null
          category: string | null
          cost: number | null
          created_at: string
          description: string | null
          id: string
          min_stock: number | null
          name: string
          petshop_id: string
          price: number
          stock_quantity: number | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          barcode?: string | null
          brand?: string | null
          category?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          min_stock?: number | null
          name: string
          petshop_id: string
          price: number
          stock_quantity?: number | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          barcode?: string | null
          brand?: string | null
          category?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          min_stock?: number | null
          name?: string
          petshop_id?: string
          price?: number
          stock_quantity?: number | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_petshop_id_fkey"
            columns: ["petshop_id"]
            isOneToOne: false
            referencedRelation: "petshops"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sale_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          sale_id: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity: number
          sale_id: string
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          sale_id?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string
          customer_id: string | null
          discount_amount: number | null
          employee_id: string | null
          final_amount: number
          id: string
          notes: string | null
          payment_method: string
          petshop_id: string
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          discount_amount?: number | null
          employee_id?: string | null
          final_amount: number
          id?: string
          notes?: string | null
          payment_method: string
          petshop_id: string
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          discount_amount?: number | null
          employee_id?: string | null
          final_amount?: number
          id?: string
          notes?: string | null
          payment_method?: string
          petshop_id?: string
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_petshop_id_fkey"
            columns: ["petshop_id"]
            isOneToOne: false
            referencedRelation: "petshops"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          duration: number
          id: string
          name: string
          petshop_id: string
          price_large: number
          price_medium: number
          price_small: number
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          duration: number
          id?: string
          name: string
          petshop_id: string
          price_large: number
          price_medium: number
          price_small: number
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          name?: string
          petshop_id?: string
          price_large?: number
          price_medium?: number
          price_small?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_petshop_id_fkey"
            columns: ["petshop_id"]
            isOneToOne: false
            referencedRelation: "petshops"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_petshop: {
        Args: Record<PropertyKey, never>
        Returns: {
          active: boolean | null
          address: string
          created_at: string
          email: string
          id: string
          logo_url: string | null
          max_appointments: number | null
          monthly_appointments: number | null
          name: string
          owner_id: string
          phone: string
          plan: string
          primary_color: string | null
          secondary_color: string | null
          updated_at: string
        }
      }
      get_current_user_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          role: string
          updated_at: string
          user_id: string
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
