
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  
  // Use a ref to track if initialization is complete to prevent multiple renders
  const initialized = useRef(false);
  
  // Use a ref to track mounted state to prevent updates after unmount
  const isMounted = useRef(true);
  
  // Add a timeout ref to prevent infinite loading
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Clean up function to clear timeouts
  const cleanupTimeouts = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Set a maximum time for initialization to prevent infinite loading
  useEffect(() => {
    // Set a maximum timeout for initialization (10 seconds)
    timeoutRef.current = setTimeout(() => {
      if (loading && isMounted.current) {
        console.warn("Auth initialization timed out - forcing completion");
        setLoading(false);
      }
    }, 10000);

    return cleanupTimeouts;
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Clean up function to run on unmount
    return () => {
      isMounted.current = false;
      cleanupTimeouts();
    };
  }, []);

  // Separate effect for auth initialization
  useEffect(() => {
    // Skip if already initialized to prevent double initialization
    if (initialized.current) return;
    
    initialized.current = true;
    console.log("Starting auth initialization");
    
    const initializeAuth = async () => {
      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log("Auth state changed:", event);
            
            if (!isMounted.current) return;
            
            // Update session state
            setSession(currentSession);
            setIsAuthenticated(!!currentSession);
            
            // Update user data if session exists
            if (currentSession?.user) {
              try {
                const mappedUser = await mapUserData(currentSession.user);
                if (isMounted.current) {
                  setUser(mappedUser);
                }
              } catch (error) {
                console.error("Error updating user data:", error);
              }
            } else {
              setUser(null);
            }
            
            // Always ensure loading is cleared
            setLoading(false);
          }
        );

        // Check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (isMounted.current) {
          setSession(currentSession);
          setIsAuthenticated(!!currentSession);
          
          // Fetch user profile data if session exists
          if (currentSession?.user) {
            const mappedUser = await mapUserData(currentSession.user);
            if (isMounted.current) {
              setUser(mappedUser);
            }
          } else {
            setUser(null);
          }
          
          // Initialization complete
          setLoading(false);
          console.log("Auth initialization complete:", !!currentSession ? "Authenticated" : "Not authenticated");
        }

        // Cleanup subscription on unmount
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    initializeAuth();
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

  // Show a simpler loading state during initialization
  if (loading && !user && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="md" />
          <p className="text-muted-foreground">Loading authentication...</p>
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
