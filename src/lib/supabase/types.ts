// Minimal hand-written types covering the columns the app reads directly.
// Replace with generated types when you run:
//   npx supabase gen types typescript --project-id <id> --schema public > src/lib/supabase/types.ts

export type AppRole = "owner" | "staff" | "customer";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: AppRole;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: AppRole;
          avatar_url?: string | null;
          phone?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          name: string;
          company: string | null;
          email: string | null;
          phone: string | null;
          notes: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["clients"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>;
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          client_id: string | null;
          site_id: string | null;
          assigned_to: string | null;
          status: string;
          priority: string;
          due_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          client_id?: string | null;
          site_id?: string | null;
          assigned_to?: string | null;
          status?: string;
          priority?: string;
          due_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_role: { Args: Record<string, never>; Returns: AppRole };
      is_staff: { Args: Record<string, never>; Returns: boolean };
      is_owner: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: { app_role: AppRole };
    CompositeTypes: Record<string, never>;
  };
};
