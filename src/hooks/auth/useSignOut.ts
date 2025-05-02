import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NavigateFunction } from 'react-router-dom';
import { clearStoredSession } from '@/services/sessionStorageService';

export const useSignOut = (
  setUser,
  setSession,
  setIsAuthenticated,
  setLoading,
  getIsAuthActionInProgress,
  navigate?: NavigateFunction
) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const signOut = async (currentPath?: string): Promise<void> => {
    // Vérifier si une authentification est déjà en cours avec la fonction getter
    const isAuthInProgress = getIsAuthActionInProgress();
    if (isAuthInProgress) {
      console.log("Une déconnexion est déjà en cours, opération annulée");
      toast.error("Une déconnexion est déjà en cours, veuillez patienter");
      return;
    }
    
    try {
      console.log("Déconnexion en cours...");
      setIsLoggingOut(true);
      setLoading(true);
      
      // Définir l'état d'authentification après les vérifications
      getIsAuthActionInProgress(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Erreur de déconnexion:", error.message);
        toast.error(error.message);
      } else {
        console.log("Déconnexion réussie");
        clearStoredSession();
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
        toast.success("Déconnexion réussie");

        // Rediriger l'utilisateur vers la page d'accueil après la déconnexion
        if (navigate) {
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setIsLoggingOut(false);
      setLoading(false);
      getIsAuthActionInProgress(false);
    }
  };

  return {
    signOut,
    isLoggingOut
  };
};
