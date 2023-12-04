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
            foreignKeyName: 'beneficiaries_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'beneficiaries_will_id_fkey'
            columns: ['will_id']
            isOneToOne: false
            referencedRelation: 'wills'
            referencedColumns: ['id']
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
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
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
          validated_at: string | null
          will_id: string
        }
        Insert: {
          assigned_at?: string
          has_validated?: boolean
          id?: string
          metadata?: Json | null
          user_id: string
          validated_at?: string | null
          will_id: string
        }
        Update: {
          assigned_at?: string
          has_validated?: boolean
          id?: string
          metadata?: Json | null
          user_id?: string
          validated_at?: string | null
          will_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'validators_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'validators_will_id_fkey'
            columns: ['will_id']
            isOneToOne: false
            referencedRelation: 'wills'
            referencedColumns: ['id']
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
            foreignKeyName: 'verifiers_config_id_fkey'
            columns: ['config_id']
            isOneToOne: false
            referencedRelation: 'decrypted_wallet_recovery_config'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'verifiers_config_id_fkey'
            columns: ['config_id']
            isOneToOne: false
            referencedRelation: 'wallet_recovery_config'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'verifiers_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      wallet_recovery_config: {
        Row: {
          created_at: string
          id: string
          private_key: string | null
          status: Database['public']['Enums']['config_status']
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          private_key?: string | null
          status?: Database['public']['Enums']['config_status']
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          private_key?: string | null
          status?: Database['public']['Enums']['config_status']
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'wallet_recovery_config_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      wills: {
        Row: {
          activated_at: string | null
          created_at: string
          deployed_at: string | null
          deployed_at_block: string | null
          id: string
          status: Database['public']['Enums']['will_status']
          title: string
          updated_at: string
          user_id: string
          eth_amount: string
        }
        Insert: {
          activated_at?: string | null
          created_at?: string
          deployed_at?: string | null
          deployed_at_block?: string | null
          id?: string
          status?: Database['public']['Enums']['will_status']
          title: string
          updated_at?: string
          user_id: string
          eth_amount?: string
        }
        Update: {
          activated_at?: string | null
          created_at?: string
          deployed_at?: string | null
          deployed_at_block?: string | null
          id?: string
          status?: Database['public']['Enums']['will_status']
          title?: string
          updated_at?: string
          user_id?: string
          eth_amount?: string
        }
        Relationships: [
          {
            foreignKeyName: 'wills_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      decrypted_wallet_recovery_config: {
        Row: {
          created_at: string | null
          decrypted_private_key: string | null
          id: string | null
          private_key: string | null
          status: Database['public']['Enums']['config_status'] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          decrypted_private_key?: never
          id?: string | null
          private_key?: string | null
          status?: Database['public']['Enums']['config_status'] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          decrypted_private_key?: never
          id?: string | null
          private_key?: string | null
          status?: Database['public']['Enums']['config_status'] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'wallet_recovery_config_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Functions: {
      get_private_key: {
        Args: {
          in_config_id: string
        }
        Returns: string
      }
      update_config: {
        Args: {
          in_config_id: string
          in_verifiers: unknown[]
        }
        Returns: undefined
      }
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
      config_status: 'INACTIVE' | 'ACTIVE' | 'VERIFIED' | 'EXECUTED'
      will_status: 'INACTIVE' | 'ACTIVE' | 'VALIDATED' | 'EXECUTED'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]
