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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      clientes: {
        Row: {
          ativo: boolean | null
          chat_id: number
          created_at: string | null
          email: string
          id: number
          nome: string
          senha: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          chat_id: number
          created_at?: string | null
          email: string
          id?: number
          nome: string
          senha: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          chat_id?: number
          created_at?: string | null
          email?: string
          id?: number
          nome?: string
          senha?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      execucoes: {
        Row: {
          id: string
          cliente_id: number | null
          cliente_nome: string
          total_lojas: number | null
          lojas_sincronizadas: number | null
          lojas_atrasadas: number | null
          percentual_sincronizadas: number | null
          percentual_atrasadas: number | null
          status: string | null
          erro_detalhes: string | null
          executado_em: string | null
          origem: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          cliente_id?: number | null
          cliente_nome: string
          total_lojas?: number | null
          lojas_sincronizadas?: number | null
          lojas_atrasadas?: number | null
          percentual_sincronizadas?: number | null
          percentual_atrasadas?: number | null
          status?: string | null
          erro_detalhes?: string | null
          executado_em?: string | null
          origem?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          cliente_id?: number | null
          cliente_nome?: string
          total_lojas?: number | null
          lojas_sincronizadas?: number | null
          lojas_atrasadas?: number | null
          percentual_sincronizadas?: number | null
          percentual_atrasadas?: number | null
          status?: string | null
          erro_detalhes?: string | null
          executado_em?: string | null
          origem?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "execucoes_cliente_id_fkey"
            columns: ["cliente_id"]
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          }
        ]
      }
      lojas_dados: {
        Row: {
          id: string
          execucao_id: string | null
          cliente_id: number | null
          cliente_nome: string
          loja_nome: string
          identificador: string
          atualizado_em: string | null
          sincronizada: boolean | null
          tempo_atraso_horas: number | null
          tempo_atraso_dias: number | null
          hash_loja: string | null
          data_coleta: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          execucao_id?: string | null
          cliente_id?: number | null
          cliente_nome: string
          loja_nome: string
          identificador: string
          atualizado_em?: string | null
          sincronizada?: boolean | null
          tempo_atraso_horas?: number | null
          tempo_atraso_dias?: number | null
          hash_loja?: string | null
          data_coleta?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          execucao_id?: string | null
          cliente_id?: number | null
          cliente_nome?: string
          loja_nome?: string
          identificador?: string
          atualizado_em?: string | null
          sincronizada?: boolean | null
          tempo_atraso_horas?: number | null
          tempo_atraso_dias?: number | null
          hash_loja?: string | null
          data_coleta?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lojas_dados_cliente_id_fkey"
            columns: ["cliente_id"]
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lojas_dados_execucao_id_fkey"
            columns: ["execucao_id"]
            referencedRelation: "execucoes"
            referencedColumns: ["id"]
          }
        ]
      }
      logs_execucao: {
        Row: {
          cliente_nome: string
          created_at: string | null
          detalhes: string | null
          executado_em: string
          id: number
          origem: string | null
          status: string
          total_lojas: number | null
        }
        Insert: {
          cliente_nome: string
          created_at?: string | null
          detalhes?: string | null
          executado_em: string
          id?: number
          origem?: string | null
          status: string
          total_lojas?: number | null
        }
        Update: {
          cliente_nome?: string
          created_at?: string | null
          detalhes?: string | null
          executado_em?: string
          id?: number
          origem?: string | null
          status?: string
          total_lojas?: number | null
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
