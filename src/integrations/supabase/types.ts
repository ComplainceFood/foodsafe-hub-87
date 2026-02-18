export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_findings: {
        Row: {
          assigned_to: string | null
          audit_id: string
          capa_id: string | null
          created_at: string
          description: string
          due_date: string | null
          evidence: string | null
          id: string
          severity: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          audit_id: string
          capa_id?: string | null
          created_at?: string
          description: string
          due_date?: string | null
          evidence?: string | null
          id?: string
          severity?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          audit_id?: string
          capa_id?: string | null
          created_at?: string
          description?: string
          due_date?: string | null
          evidence?: string | null
          id?: string
          severity?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_findings_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
        ]
      }
      audits: {
        Row: {
          assigned_to: string | null
          audit_type: string | null
          completion_date: string | null
          created_at: string
          created_by: string | null
          department: string | null
          description: string | null
          due_date: string | null
          findings_count: number | null
          id: string
          scope: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          audit_type?: string | null
          completion_date?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          due_date?: string | null
          findings_count?: number | null
          id?: string
          scope?: string | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          audit_type?: string | null
          completion_date?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          due_date?: string | null
          findings_count?: number | null
          id?: string
          scope?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      capas: {
        Row: {
          assigned_to: string | null
          corrective_action: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          effectiveness_criteria: string | null
          id: string
          preventive_action: string | null
          priority: string | null
          root_cause: string | null
          source: string | null
          source_reference: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          corrective_action?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          effectiveness_criteria?: string | null
          id?: string
          preventive_action?: string | null
          priority?: string | null
          root_cause?: string | null
          source?: string | null
          source_reference?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          corrective_action?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          effectiveness_criteria?: string | null
          id?: string
          preventive_action?: string | null
          priority?: string | null
          root_cause?: string | null
          source?: string | null
          source_reference?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      complaints: {
        Row: {
          assigned_to: string | null
          batch_lot_number: string | null
          capa_id: string | null
          category: string | null
          created_at: string
          created_by: string | null
          customer_contact: string | null
          customer_name: string | null
          description: string | null
          id: string
          priority: string | null
          product_name: string | null
          resolution: string | null
          resolution_date: string | null
          source: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          batch_lot_number?: string | null
          capa_id?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          customer_contact?: string | null
          customer_name?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          product_name?: string | null
          resolution?: string | null
          resolution_date?: string | null
          source?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          batch_lot_number?: string | null
          capa_id?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          customer_contact?: string | null
          customer_name?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          product_name?: string | null
          resolution?: string | null
          resolution_date?: string | null
          source?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      components: {
        Row: {
          batch_number: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          lot_number: string | null
          name: string
          status: string | null
          supplier: string | null
          updated_at: string
        }
        Insert: {
          batch_number?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          lot_number?: string | null
          name: string
          status?: string | null
          supplier?: string | null
          updated_at?: string
        }
        Update: {
          batch_number?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          lot_number?: string | null
          name?: string
          status?: string | null
          supplier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          approved_by: string | null
          category: string | null
          content: string | null
          created_at: string
          created_by: string | null
          department: string | null
          description: string | null
          expiry_date: string | null
          file_path: string | null
          file_type: string | null
          id: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          version: string | null
        }
        Insert: {
          approved_by?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          expiry_date?: string | null
          file_path?: string | null
          file_type?: string | null
          id?: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          approved_by?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          expiry_date?: string | null
          file_path?: string | null
          file_type?: string | null
          id?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      nc_activities: {
        Row: {
          action: string
          comments: string | null
          id: string
          new_status: string | null
          non_conformance_id: string
          performed_at: string
          performed_by: string
          previous_status: string | null
        }
        Insert: {
          action: string
          comments?: string | null
          id?: string
          new_status?: string | null
          non_conformance_id: string
          performed_at?: string
          performed_by: string
          previous_status?: string | null
        }
        Update: {
          action?: string
          comments?: string | null
          id?: string
          new_status?: string | null
          non_conformance_id?: string
          performed_at?: string
          performed_by?: string
          previous_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nc_activities_non_conformance_id_fkey"
            columns: ["non_conformance_id"]
            isOneToOne: false
            referencedRelation: "non_conformances"
            referencedColumns: ["id"]
          },
        ]
      }
      nc_attachments: {
        Row: {
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          non_conformance_id: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          non_conformance_id: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          non_conformance_id?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "nc_attachments_non_conformance_id_fkey"
            columns: ["non_conformance_id"]
            isOneToOne: false
            referencedRelation: "non_conformances"
            referencedColumns: ["id"]
          },
        ]
      }
      non_conformances: {
        Row: {
          assigned_to: string | null
          capa_id: string | null
          closed_date: string | null
          corrective_action: string | null
          created_at: string
          created_by: string | null
          department: string | null
          description: string | null
          due_date: string | null
          id: string
          immediate_action: string | null
          item_category: string | null
          item_id: string | null
          item_name: string
          location: string | null
          preventive_action: string | null
          priority: string | null
          quantity: number | null
          quantity_on_hold: number | null
          reason_category: string | null
          reason_details: string | null
          reported_date: string | null
          resolution_date: string | null
          resolution_details: string | null
          review_date: string | null
          risk_level: string | null
          root_cause: string | null
          severity: string | null
          status: string
          tags: string[] | null
          title: string
          units: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          capa_id?: string | null
          closed_date?: string | null
          corrective_action?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          immediate_action?: string | null
          item_category?: string | null
          item_id?: string | null
          item_name?: string
          location?: string | null
          preventive_action?: string | null
          priority?: string | null
          quantity?: number | null
          quantity_on_hold?: number | null
          reason_category?: string | null
          reason_details?: string | null
          reported_date?: string | null
          resolution_date?: string | null
          resolution_details?: string | null
          review_date?: string | null
          risk_level?: string | null
          root_cause?: string | null
          severity?: string | null
          status?: string
          tags?: string[] | null
          title: string
          units?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          capa_id?: string | null
          closed_date?: string | null
          corrective_action?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          immediate_action?: string | null
          item_category?: string | null
          item_id?: string | null
          item_name?: string
          location?: string | null
          preventive_action?: string | null
          priority?: string | null
          quantity?: number | null
          quantity_on_hold?: number | null
          reason_category?: string | null
          reason_details?: string | null
          reported_date?: string | null
          resolution_date?: string | null
          resolution_details?: string | null
          review_date?: string | null
          risk_level?: string | null
          root_cause?: string | null
          severity?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          units?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      product_components: {
        Row: {
          component_id: string
          created_at: string
          id: string
          product_id: string
          quantity: number | null
        }
        Insert: {
          component_id: string
          created_at?: string
          id?: string
          product_id: string
          quantity?: number | null
        }
        Update: {
          component_id?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_components_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_components_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          batch_number: string | null
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          expiry_date: string | null
          id: string
          lot_number: string | null
          manufactured_date: string | null
          name: string
          sku: string | null
          status: string | null
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          batch_number?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          lot_number?: string | null
          manufactured_date?: string | null
          name: string
          sku?: string | null
          status?: string | null
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          batch_number?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          lot_number?: string | null
          manufactured_date?: string | null
          name?: string
          sku?: string | null
          status?: string | null
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string | null
          full_name: string | null
          id: string
          organization_id: string | null
          preferences: Json | null
          role: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          organization_id?: string | null
          preferences?: Json | null
          role?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          preferences?: Json | null
          role?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recalls: {
        Row: {
          affected_batches: string[] | null
          affected_products: string[] | null
          completion_date: string | null
          created_at: string
          description: string | null
          id: string
          initiated_by: string | null
          initiated_date: string | null
          notification_sent: boolean | null
          severity: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          affected_batches?: string[] | null
          affected_products?: string[] | null
          completion_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          initiated_by?: string | null
          initiated_date?: string | null
          notification_sent?: boolean | null
          severity?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          affected_batches?: string[] | null
          affected_products?: string[] | null
          completion_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          initiated_by?: string | null
          initiated_date?: string | null
          notification_sent?: boolean | null
          severity?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          category: string | null
          certification: string[] | null
          contact_name: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          last_audit_date: string | null
          name: string
          next_audit_date: string | null
          notes: string | null
          phone: string | null
          rating: number | null
          risk_level: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          category?: string | null
          certification?: string[] | null
          contact_name?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          last_audit_date?: string | null
          name: string
          next_audit_date?: string | null
          notes?: string | null
          phone?: string | null
          rating?: number | null
          risk_level?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          category?: string | null
          certification?: string[] | null
          contact_name?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          last_audit_date?: string | null
          name?: string
          next_audit_date?: string | null
          notes?: string | null
          phone?: string | null
          rating?: number | null
          risk_level?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      training_records: {
        Row: {
          assigned_to: string | null
          category: string | null
          completion_date: string | null
          created_at: string
          created_by: string | null
          department: string | null
          description: string | null
          due_date: string | null
          id: string
          score: number | null
          status: string | null
          title: string
          trainer: string | null
          training_type: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          completion_date?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          score?: number | null
          status?: string | null
          title: string
          trainer?: string | null
          training_type?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          completion_date?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          score?: number | null
          status?: string | null
          title?: string
          trainer?: string | null
          training_type?: string | null
          updated_at?: string
        }
        Relationships: []
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
