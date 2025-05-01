
import { User, Session } from '@supabase/supabase-js';
import { UserRole } from "@/types/user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  forceSignOut: () => void;
  isAuthenticated: boolean;
  session: Session | null;
  authError: string | null;
  forceResetLoading?: () => void;
}
