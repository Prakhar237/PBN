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
      blog_biblepeacefinder: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_digitalproduct: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_forgetcheck: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      BlogData: {
        Row: {
          affiliate_partner_link: string | null
          content_structure: string | null
          created_at: string
          domain: string | null
          id: number
          product_promotion: string[] | null
          website_context: string | null
        }
        Insert: {
          affiliate_partner_link?: string | null
          content_structure?: string | null
          created_at?: string
          domain?: string | null
          id?: number
          product_promotion?: string[] | null
          website_context?: string | null
        }
        Update: {
          affiliate_partner_link?: string | null
          content_structure?: string | null
          created_at?: string
          domain?: string | null
          id?: number
          product_promotion?: string[] | null
          website_context?: string | null
        }
        Relationships: []
      }
      AFFILIATE_OFFERS: {
        Row: {
          id: number
          created_at: string | null
          affiliate_offer_1: string | null
          affiliate_offer_2: string | null
          affiliate_offer_3: string | null
          affiliate_offer_4: string | null
          affiliate_offer_5: string | null
          affiliate_offer_6: string | null
          affiliate_offer_7: string | null
          affiliate_offer_8: string | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          affiliate_offer_1?: string | null
          affiliate_offer_2?: string | null
          affiliate_offer_3?: string | null
          affiliate_offer_4?: string | null
          affiliate_offer_5?: string | null
          affiliate_offer_6?: string | null
          affiliate_offer_7?: string | null
          affiliate_offer_8?: string | null
        }
        Update: {
          id?: number
          created_at?: string | null
          affiliate_offer_1?: string | null
          affiliate_offer_2?: string | null
          affiliate_offer_3?: string | null
          affiliate_offer_4?: string | null
          affiliate_offer_5?: string | null
          affiliate_offer_6?: string | null
          affiliate_offer_7?: string | null
          affiliate_offer_8?: string | null
        }
        Relationships: []
      }
      Links: {
        Row: {
          id: number
          Link_P: string | null
        }
        Insert: {
          id?: number
          Link_P?: string | null
        }
        Update: {
          id?: number
          Link_P?: string | null
        }
        Relationships: []
      }
      ideas: {
        Row: {
          created_at: string | null
          description: string
          id: string
          niche: string
          platform: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          niche: string
          platform: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          niche?: string
          platform?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          is_active: boolean | null
          price: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          price: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          price?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      scripts: {
        Row: {
          content: string | null
          created_at: string | null
          hook: string | null
          id: string
          niche: string
          platform: string
          prompt: string
          timestamps: string[] | null
          title: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          hook?: string | null
          id?: string
          niche: string
          platform: string
          prompt: string
          timestamps?: string[] | null
          title: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          hook?: string | null
          id?: string
          niche?: string
          platform?: string
          prompt?: string
          timestamps?: string[] | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_game_state: {
        Args: {
          p_user_id: string
          p_position_x: number
          p_position_y: number
          p_position_z: number
          p_health: number
          p_inventory: Json
          p_current_mission: string
          p_achievements: Json
        }
        Returns: Json
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
