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
      beneficiaries: {
        Row: {
          assigned_at: string
          id: string
          metadata: Json | null
          percentage: number
          user_id: string | null
          will_id: string
        }
        Insert: {
          assigned_at?: string
          id?: string
          metadata?: Json | null
          percentage: number
          user_id?: string | null
          will_id: string
        }
        Update: {
          assigned_at?: string
          id?: string
          metadata?: Json | null
          percentage?: number
          user_id?: string | null
          will_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "beneficiaries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beneficiaries_will_id_fkey"
            columns: ["will_id"]
            referencedRelation: "wills"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          ic_number: string | null
          id: string
          last_name: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          ic_number?: string | null
          id: string
          last_name: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          ic_number?: string | null
          id?: string
          last_name?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      validators: {
        Row: {
          assigned_at: string
          has_validated: boolean
          id: string
          metadata: Json | null
          user_id: string
          will_id: string
        }
        Insert: {
          assigned_at?: string
          has_validated?: boolean
          id?: string
          metadata?: Json | null
          user_id: string
          will_id: string
        }
        Update: {
          assigned_at?: string
          has_validated?: boolean
          id?: string
          metadata?: Json | null
          user_id?: string
          will_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "validators_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validators_will_id_fkey"
            columns: ["will_id"]
            referencedRelation: "wills"
            referencedColumns: ["id"]
          }
        ]
      }
      verifiers: {
        Row: {
          assigned_at: string
          config_id: string
          has_verified: boolean
          id: string
          metadata: Json | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          assigned_at?: string
          config_id: string
          has_verified?: boolean
          id?: string
          metadata?: Json | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          assigned_at?: string
          config_id?: string
          has_verified?: boolean
          id?: string
          metadata?: Json | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verifiers_config_id_fkey"
            columns: ["config_id"]
            referencedRelation: "wallet_recovery_config"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verifiers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      wallet_recovery_config: {
        Row: {
          created_at: string
          id: string
          private_key: string | null
          status: Database["public"]["Enums"]["config_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          private_key?: string | null
          status?: Database["public"]["Enums"]["config_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          private_key?: string | null
          status?: Database["public"]["Enums"]["config_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_recovery_config_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      wills: {
        Row: {
          contract_address: string | null
          created_at: string
          deployed_at: string | null
          deployed_at_block: string | null
          id: string
          status: Database["public"]["Enums"]["will_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contract_address?: string | null
          created_at?: string
          deployed_at?: string | null
          deployed_at_block?: string | null
          id?: string
          status?: Database["public"]["Enums"]["will_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contract_address?: string | null
          created_at?: string
          deployed_at?: string | null
          deployed_at_block?: string | null
          id?: string
          status?: Database["public"]["Enums"]["will_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wills_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_will: {
        Args: {
          in_will_id: string
          in_title: string
          in_beneficiaries: unknown[]
          in_validators: unknown[]
        }
        Returns: undefined
      }
    }
    Enums: {
      config_status: "INACTIVE" | "ACTIVE" | "VERIFIED" | "EXECUTED"
      will_status: "INACTIVE" | "ACTIVE" | "VALIDATED" | "EXECUTED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
// etc.