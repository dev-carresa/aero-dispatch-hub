
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { mapUserData } from "../utils";

export function useAuthMethods({ 
  setUser, 
  setSession, 
  setIsAuthenticated, 
  setLoading 
}: {
  setUser: (user: any) => void;
  setSession: (session: any) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
}) {
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
  
  // New method for force sign out - will always clear local state
  const forceSignOut = () => {
    console.log("Force signing out...");
    try {
      // First try the normal signOut method with supabase
      supabase.auth.signOut()
        .catch(error => {
          console.warn("Force sign out: API call failed, continuing with local cleanup", error);
        })
        .finally(() => {
          // Always clear local state even if API call fails
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          
          // Clear local storage to remove any tokens
          localStorage.removeItem('supabase.auth.token');
          localStorage.removeItem('supabase.auth.expires_at');
          localStorage.removeItem('supabase.auth.refresh_token');
          
          toast.success("Successfully logged out");
          console.log("Force sign out successful");
          
          // Redirect to login page
          window.location.href = '/';
        });
    } catch (error) {
      // This catch should never trigger because we have a .catch on the Promise
      console.error("Force sign out critical error:", error);
      
      // As a last resort, just redirect to login
      window.location.href = '/';
    }
  };

  return {
    signIn,
    signOut,
    forceSignOut
  };
}
