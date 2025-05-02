
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { mapUserData, clearUserProfileCache } from './useUser';
import { NavigateFunction } from 'react-router-dom';
import { 
  storeUserSession, 
  clearUserSession, 
  updateSessionExpiry 
} from '@/services/sessionStorageService';

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

  // Rafraîchir silencieusement le token
  const refreshToken = async () => {
    try {
      console.log("Rafraîchissement silencieux du token...");
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Erreur lors du rafraîchissement du token:", error);
        return false;
      }
      
      if (data?.session) {
        // Mettre à jour les dates d'expiration dans le stockage local
        const expiresIn = data.session.expires_in || 3600;
        updateSessionExpiry(expiresIn);
        
        console.log("Token rafraîchi avec succès");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erreur inattendue lors du rafraîchissement du token:", error);
      return false;
    }
  };

  // Sign in function - modifié pour stocker plus d'informations
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

      if (data.user && data.session) {
        console.log("Sign in successful");
        
        // Stockage des données utilisateur enrichies
        try {
          const userData = await mapUserData(data.user);
          
          if (userData) {
            // Stocker les données utilisateur et la date d'expiration dans localStorage
            storeUserSession(
              userData.id,
              userData.email,
              userData.name,
              userData.role,
              data.session.expires_in || 3600
            );
            
            // Définir les états
            setUser(userData);
            setSession(data.session);
            setIsAuthenticated(true);
            
            toast.success("Connexion réussie");
            
            // Utiliser React Router pour la navigation
            if (navigate) {
              navigate('/dashboard');
            }
          }
        } catch (profileError) {
          console.error("Erreur lors du chargement du profil:", profileError);
          
          // En cas d'erreur de profil, utiliser les données de base
          const basicUserInfo = {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.email?.split('@')[0] || 'User',
            role: 'Customer'
          };
          
          storeUserSession(
            basicUserInfo.id,
            basicUserInfo.email,
            basicUserInfo.name,
            basicUserInfo.role,
            data.session.expires_in || 3600
          );
          
          setUser(basicUserInfo);
          setSession(data.session);
          setIsAuthenticated(true);
          
          toast.success("Connexion réussie");
          
          if (navigate) {
            navigate('/dashboard');
          }
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
      setIsAuthActionInProgress(false);
    }
  };

  // Sign out function - amélioré pour nettoyer toutes les données
  const signOut = async () => {
    // Prevent multiple simultaneous auth actions
    if (isAuthActionInProgress) return;
    
    console.log("Signing out...");
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
        console.error("Sign out error:", error);
        toast.error(`Échec de la déconnexion: ${error.message}`);
        throw error;
      }
      
      // Réinitialiser les états
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      toast.success("Déconnexion réussie");
      console.log("Sign out successful");
      
      // Utiliser React Router pour la navigation
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
    refreshToken,
    isLoggingOut
  };
};
