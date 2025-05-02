
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { clearUserProfileCache } from './userProfileCache';
import { clearUserSession } from '@/services/sessionStorageService';
import { NavigateFunction } from 'react-router-dom';
import { AUTH_CONSTANTS } from './utils/authUtils';
import { UserRole } from '@/types/user';

export const useSignOut = (
  setUser,
  setSession,
  setIsAuthenticated,
  setLoading,
  getIsAuthActionInProgress,
  navigate?: NavigateFunction
) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Sign out function - améliorée pour prendre en compte le rôle de l'utilisateur
  const signOut = async (): Promise<void> => {
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
      
      // Stocker le rôle de l'utilisateur avant de nettoyer les données
      // On doit mémoriser temporairement le rôle pour la redirection
      let userRole: UserRole | null = null;
      const currentSession = await supabase.auth.getSession();
      if (currentSession?.data?.session?.user) {
        // Récupérer l'utilisateur actuel pour déterminer son rôle
        const { data: userData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentSession.data.session.user.id)
          .single();
        
        if (userData) {
          userRole = userData.role as UserRole;
          console.log("Rôle de l'utilisateur pour redirection:", userRole);
        }
      }
      
      // CHANGEMENT CRITIQUE: D'abord appeler l'API Supabase pour la déconnexion
      // *avant* de nettoyer les données locales
      const { error } = await supabase.auth.signOut({
        scope: 'global' // Sign out from all tabs/devices
      });
      
      if (error) {
        console.error("Erreur lors de la déconnexion:", error);
        toast.error(`Échec de la déconnexion: ${error.message}`);
        throw error;
      }
      
      // Ensuite seulement, nettoyage du cache et du stockage local
      clearUserProfileCache();
      clearUserSession();
      
      // Réinitialiser les états
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      toast.success("Déconnexion réussie");
      console.log("Déconnexion réussie");
      
      // Utiliser React Router pour la navigation basée sur le rôle
      if (navigate) {
        // Rediriger vers la page de connexion admin si l'utilisateur était un admin
        if (userRole === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
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
