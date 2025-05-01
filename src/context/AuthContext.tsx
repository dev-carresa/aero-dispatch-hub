
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
  isAuthenticated: false,
  session: null
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initializationComplete, setInitializationComplete] = useState(false);

  // Convert Supabase User to AuthUser with role
  const mapUserData = async (supabaseUser: User | null): Promise<AuthUser | null> => {
    if (!supabaseUser) return null;

    try {
      // Fetch user profile to get role
      const { data, error } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (!data) {
        console.warn('No profile found for user:', supabaseUser.id);
        return null;
      }

      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: data.name || supabaseUser.email?.split('@')[0] || 'User',
        role: data.role as UserRole
      };
    } catch (error) {
      console.error('Error mapping user data:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Track whether component is mounted to prevent state updates after unmount
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        // First, check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (isMounted) {
          setSession(currentSession);
          setIsAuthenticated(!!currentSession);
          
          // Fetch user profile data if session exists
          if (currentSession?.user) {
            const mappedUser = await mapUserData(currentSession.user);
            if (isMounted) {
              setUser(mappedUser);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        // Always set these flags when initialization is done, even if there was an error
        if (isMounted) {
          setInitializationComplete(true);
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? "session exists" : "no session");
        
        if (!isMounted) return;
        
        // Update session state
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
        
        // Update user data if session exists
        if (currentSession?.user) {
          setLoading(true);
          try {
            const mappedUser = await mapUserData(currentSession.user);
            if (isMounted) {
              setUser(mappedUser);
            }
          } catch (error) {
            console.error("Error updating user data:", error);
          } finally {
            if (isMounted) {
              setLoading(false);
            }
          }
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Initialize auth state
    initializeAuth();

    // Cleanup
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      if (data.user) {
        const mappedUser = await mapUserData(data.user);
        setUser(mappedUser);
        setSession(data.session);
        setIsAuthenticated(true);
        toast.success("Successfully logged in!");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log("Signing out...");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast.error(`Sign out failed: ${error.message}`);
        throw error;
      }
      
      // Clear user state regardless of API success
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      toast.success("Successfully logged out");
      console.log("Sign out successful");
      
      // Force a reload to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Sign out failed");
    } finally {
      setLoading(false);
    }
  };

  // Use a dedicated loading component to render during initialization
  if (!initializationComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isAuthenticated, session }}>
      {children}
    </AuthContext.Provider>
  );
};
