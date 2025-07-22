export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string;
          title: string;
          url: string;
          analysis: string | null;
          createdAt: string;
          ownerId: string;
          sessionId: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          url: string;
          analysis?: string | null;
          createdAt?: string;
          ownerId: string;
          sessionId?: string | null;
        };
        Update: Partial<Database['public']['Tables']['documents']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          role: string;
          createdAt: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          role?: string;
          createdAt?: string;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
