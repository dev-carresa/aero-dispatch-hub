
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { clearUserProfileCache } from './userProfileCache';
import { clearUserSession } from '@/services/sessionStorageService';
import { NavigateFunction } from 'react-router-dom';
import { AUTH_CONSTANTS } from './utils/authUtils';

export const useSignOut = (
  setUser,
  setSession,
  setIsAuthenticated,
  setLoading,
  getIsAuthActionInProgress,
  navigate?: NavigateFunction
) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Helper function to check if a route is an admin route
  const isAdminRoute = (path: string): boolean => {
    return path === '/admin' || path.startsWith('/admin-');
  };

  // Sign out function - améliorée pour éviter les problèmes
  const signOut = async (currentPath?: string): Promise<void> => {
    // Prevent multiple simultaneous auth actions
    const isAuthInProgress = getIsAuthActionInProgress();
    if (isAuthInProgress) {
      console.log("Une déconnexion est déjà en cours, opération annulée");
      return;
    }
    
    console.log("Déconnexion en cours...");
    try {
      getIsAuthActionInProgress(true);
      setIsLoggingOut(true);
      
      // Déterminer la page de redirection en fonction du chemin actuel
      const redirectPath = currentPath && isAdminRoute(currentPath) ? '/admin' : '/';
      console.log(`Redirection prévue vers : ${redirectPath} (chemin actuel: ${currentPath})`);
      
      // Appel API Supabase pour la déconnexion - DOIT ÊTRE FAIT EN PREMIER
      const { error } = await supabase.auth.signOut({
        scope: 'global' // Sign out from all tabs/devices
      });
      
      if (error) {
        console.error("Erreur lors de la déconnexion:", error);
        toast.error(`Échec de la déconnexion: ${error.message}`);
        throw error;
      }
      
      // Nettoyage du cache et du stockage local APRÈS la déconnexion Supabase
      clearUserProfileCache();
      clearUserSession();
      
      // Réinitialiser les états
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      toast.success("Déconnexion réussie");
      console.log(`Déconnexion réussie, redirection vers ${redirectPath}`);
      
      // Utiliser React Router pour la navigation
      if (navigate) {
        navigate(redirectPath);
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Échec de la déconnexion");
    } finally {
      setTimeout(() => {
        setIsLoggingOut(false);
        getIsAuthActionInProgress(false);
        setLoading(false);
      }, AUTH_CONSTANTS.AUTH_ACTION_RESET_DELAY);
    }
  };

  return { signOut, isLoggingOut };
};
