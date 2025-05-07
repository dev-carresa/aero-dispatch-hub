
import { UserRole } from "@/types/user";
import { Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  session: Session | null;
  isLoggingOut: boolean;
  authError: string | null;
  hasPermission: (permission: string) => boolean;
}
