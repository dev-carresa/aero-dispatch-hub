
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
    // Updated to match the new routing structure
    return path === '/admin' || path.startsWith('/admin/') || path.startsWith('/admin-');
  };

  // Sign out function - améliorée pour éviter les problèmes et garantir la redirection
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
      const redirectPath = currentPath && isAdminRoute(currentPath) ? '/admin/login' : '/';
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
        
        // Pour les pages admin, ajouter une redirection forcée après un court délai
        if (isAdminRoute(currentPath)) {
          console.log("Ajout d'une redirection forcée vers /admin/login après délai de 100ms");
          setTimeout(() => {
            console.log("Redirection forcée vers la page d'admin login");
            window.location.href = '/admin/login';
          }, AUTH_CONSTANTS.NAVIGATION_DELAY);
        }
      } else {
        // Si pas de navigate disponible, forcer la redirection
        console.log("Fonction navigate non disponible, utilisation de window.location");
        setTimeout(() => {
          window.location.href = redirectPath;
        }, AUTH_CONSTANTS.NAVIGATION_DELAY);
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Échec de la déconnexion");
      
      // En cas d'erreur sur une page admin, rediriger vers login admin
      if (currentPath && isAdminRoute(currentPath)) {
        setTimeout(() => {
          console.log("Redirection vers /admin/login suite à une erreur");
          window.location.href = '/admin/login';
        }, AUTH_CONSTANTS.NAVIGATION_DELAY);
      }
    } finally {
      // Réinitialisation des états
      setTimeout(() => {
        setIsLoggingOut(false);
        getIsAuthActionInProgress(false);
        setLoading(false);
        
        // Redirection de sécurité supplémentaire pour les pages admin
        if (currentPath && isAdminRoute(currentPath)) {
          console.log("Redirection finale de sécurité vers /admin/login");
          window.location.href = '/admin/login';
        }
      }, AUTH_CONSTANTS.AUTH_ACTION_RESET_DELAY);
    }
  };

  return { signOut, isLoggingOut };
};
