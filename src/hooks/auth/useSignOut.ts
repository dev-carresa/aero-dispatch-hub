
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { clearUserProfileCache } from './useUser';
import { clearUserSession } from '@/services/sessionStorageService';
import { NavigateFunction } from 'react-router-dom';
import { AUTH_CONSTANTS } from './utils/authUtils';

export const useSignOut = (
  setUser,
  setSession,
  setIsAuthenticated,
  setLoading,
  setIsAuthActionInProgress,
  navigate?: NavigateFunction
) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Sign out function - améliorée pour éviter les problèmes
  const signOut = async (): Promise<void> => {
    // Prevent multiple simultaneous auth actions
    if (setIsAuthActionInProgress(true)) {
      console.log("Une déconnexion est déjà en cours, opération annulée");
      return;
    }
    
    console.log("Déconnexion en cours...");
    try {
      setIsAuthActionInProgress(true);
      setIsLoggingOut(true);
      
      // Nettoyage du cache et du stockage local avant la déconnexion
      clearUserProfileCache();
      clearUserSession();
      
      // Appel API Supabase pour la déconnexion
      const { error } = await supabase.auth.signOut({
        scope: 'global' // Sign out from all tabs/devices
      });
      
      if (error) {
        console.error("Erreur lors de la déconnexion:", error);
        toast.error(`Échec de la déconnexion: ${error.message}`);
        throw error;
      }
      
      // Réinitialiser les états
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      toast.success("Déconnexion réussie");
      console.log("Déconnexion réussie");
      
      // Utiliser React Router pour la navigation
      if (navigate) {
        navigate('/');
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Échec de la déconnexion");
    } finally {
      setTimeout(() => {
        setIsLoggingOut(false);
        setIsAuthActionInProgress(false);
        setLoading(false);
      }, AUTH_CONSTANTS.AUTH_ACTION_RESET_DELAY);
    }
  };

  return { signOut, isLoggingOut };
};
