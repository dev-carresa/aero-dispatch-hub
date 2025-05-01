
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';
import { toast } from "sonner";

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
  signOut: () => void;
  isAuthenticated: boolean;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => {},
  signOut: () => {},
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

  // Convert Supabase User to AuthUser with role
  const mapUserData = async (supabaseUser: User | null): Promise<AuthUser | null> => {
    if (!supabaseUser) return null;

    try {
      // Fetch user profile to get role
      const { data, error } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
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

  // Check for existing session on load
  useEffect(() => {
    // First, set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setLoading(true);
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
        
        // Fetch user profile data asynchronously
        if (currentSession?.user) {
          const mappedUser = await mapUserData(currentSession.user);
          setUser(mappedUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setIsAuthenticated(!!currentSession);
      
      if (currentSession?.user) {
        const mappedUser = await mapUserData(currentSession.user);
        setUser(mappedUser);
      }
      setLoading(false);
    });

    return () => {
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
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      toast.success("Successfully logged out");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Sign out failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isAuthenticated, session }}>
      {children}
    </AuthContext.Provider>
  );
};
