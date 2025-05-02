
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { mapUserData } from './useUser';
import { NavigateFunction } from 'react-router-dom';

export const useAuthActions = (
  setUser,
  setSession,
  setIsAuthenticated,
  setLoading,
  setAuthError,
  navigate?: NavigateFunction
) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthActionInProgress, setIsAuthActionInProgress] = useState(false);

  // Sign in function
  const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    // Prevent multiple simultaneous auth actions
    if (isAuthActionInProgress) return;
    
    try {
      console.log("Attempting sign in for:", email, "with remember me:", rememberMe);
      setIsAuthActionInProgress(true);
      setLoading(true);
      setAuthError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Sign in error:", error.message);
        toast.error(error.message);
        setAuthError(`Login failed: ${error.message}`);
        throw error;
      }

      if (data.user) {
        console.log("Sign in successful");
        toast.success("Connexion réussie");
        
        // We don't set state here as the auth listener will handle this
        
        // Use React Router navigation instead of full page reload
        if (navigate) {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
      setIsAuthActionInProgress(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    // Prevent multiple simultaneous auth actions
    if (isAuthActionInProgress) return;
    
    console.log("Signing out...");
    try {
      setIsAuthActionInProgress(true);
      setIsLoggingOut(true);
      
      // Call Supabase API to sign out - this will trigger the auth listener
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
      
      // Use React Router navigation instead of full page reload
      if (navigate) {
        navigate('/');
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Échec de la déconnexion");
    } finally {
      setIsLoggingOut(false);
      setIsAuthActionInProgress(false);
      setLoading(false);
    }
  };

  return {
    signIn,
    signOut,
    isLoggingOut
  };
};
