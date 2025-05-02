
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { mapUserData } from './useUser';

export const useAuthActions = (
  setUser,
  setSession,
  setIsAuthenticated,
  setLoading,
  setAuthError
) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Sign in function
  const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      console.log("Attempting sign in for:", email, "with remember me:", rememberMe);
      setLoading(true);
      setAuthError(null);
      
      // Clear any previous session first to avoid conflicts
      await supabase.auth.signOut({ scope: 'local' });
      
      // Set session expiry based on remember me choice
      // If rememberMe is false, we'll use shorter session duration
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // Session duration is controlled by Supabase project settings
          // We're not using expiresIn as it's not a valid property in the options
        }
      });

      if (error) {
        console.error("Sign in error:", error.message);
        toast.error(error.message);
        setAuthError(`Login failed: ${error.message}`);
        setLoading(false);
        throw error;
      }

      if (data.user) {
        console.log("Sign in successful");
        toast.success("Connexion réussie");
        
        // Set session and auth state
        setSession(data.session);
        setIsAuthenticated(true);
        
        // Map user data
        try {
          const mappedUser = await mapUserData(data.user);
          setUser(mappedUser);
        } catch (err) {
          console.error("Error mapping user after sign in:", err);
        }
        
        // Navigate to dashboard
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setLoading(false);
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    console.log("Signing out...");
    try {
      setIsLoggingOut(true);
      
      // Clear local state immediately for responsive UI
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      // Explicitly clear local storage
      localStorage.removeItem('sb-qqfnokbhdzmffywksmvl-auth-token');
      
      // Call Supabase API to sign out
      const { error } = await supabase.auth.signOut({
        scope: 'global' // Sign out from all tabs/devices
      });
      
      if (error) {
        console.error("Sign out error:", error);
        toast.error(`Échec de la déconnexion: ${error.message}`);
        throw error;
      }
      
      toast.success("Déconnexion réussie");
      console.log("Sign out successful");
      
      // Force navigation to login page
      window.location.href = '/';
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Échec de la déconnexion");
    } finally {
      setIsLoggingOut(false);
      setLoading(false);
    }
  };

  return {
    signIn,
    signOut,
    isLoggingOut
  };
};
