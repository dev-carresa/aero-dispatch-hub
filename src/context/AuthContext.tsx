
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole } from "@/types/user";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  userRole: UserRole | null;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signUp: (email: string, password: string, metadata?: { firstName?: string; lastName?: string; role?: UserRole }) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null };
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Load user role from profile
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }
      
      return data?.role as UserRole | null;
    } catch (err) {
      console.error("Error in fetchUserRole:", err);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Try to get role from profile first
          const profileRole = await fetchUserRole(session.user.id);
          setUserRole(profileRole || session?.user?.user_metadata?.role as UserRole || null);
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Try to get role from profile first
        const profileRole = await fetchUserRole(session.user.id);
        setUserRole(profileRole || session?.user?.user_metadata?.role as UserRole || null);
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Set user role from profile or metadata
      if (data.user) {
        const profileRole = await fetchUserRole(data.user.id);
        setUserRole(profileRole || data.user.user_metadata?.role as UserRole || null);
      }
      
      return { data: data.session, error: null };
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
      return { data: null, error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: { firstName?: string; lastName?: string; role?: UserRole }) => {
    try {
      const role = metadata?.role || "Customer"; // Default role is Customer if not specified
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: metadata ? `${metadata.firstName || ''} ${metadata.lastName || ''}`.trim() : '',
            first_name: metadata?.firstName || '',
            last_name: metadata?.lastName || '',
            role: role,
          },
        },
      });
      
      if (error) throw error;
      
      // Set user role from metadata initially (profile will be created by trigger)
      if (data.user) {
        setUserRole(data.user.user_metadata?.role as UserRole || null);
      }
      
      return { data: { user: data.user, session: data.session }, error: null };
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign up");
      return { data: { user: null, session: null }, error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUserRole(null);
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
      console.error(error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/auth/update-password",
      });
      
      if (error) throw error;
      
      toast.success("Password reset email sent");
      return { error: null };
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send reset email");
      return { error: error as Error };
    }
  };

  const value = {
    session,
    user,
    loading,
    userRole,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
