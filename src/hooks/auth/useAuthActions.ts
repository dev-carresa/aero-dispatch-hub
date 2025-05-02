
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { mapUserData, clearUserProfileCache } from './useUser';
import { NavigateFunction } from 'react-router-dom';
import { 
  storeUserSession, 
  clearUserSession, 
  updateSessionExpiry,
  rememberUserEmail,
  getRememberedEmail
} from '@/services/sessionStorageService';

// Add debounce utility to prevent multiple rapid login attempts
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      func.apply(null, args);
    }, delay);
  };
};

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
  const [loginAttemptCount, setLoginAttemptCount] = useState(0);
  const [lastLoginTimestamp, setLastLoginTimestamp] = useState(0);

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

  // Sign in function - améliorée pour gérer les promesses, limiter les tentatives et mieux traiter les erreurs
  const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    // Vérifier si une authentification est déjà en cours
    if (isAuthActionInProgress) {
      console.log("Une authentification est déjà en cours, opération annulée");
      toast.error("Une connexion est déjà en cours, veuillez patienter");
      return Promise.reject(new Error("Authentication already in progress"));
    }
    
    // Vérifier le temps écoulé depuis la dernière tentative
    const now = Date.now();
    const timeSinceLastAttempt = now - lastLoginTimestamp;
    const MIN_TIME_BETWEEN_ATTEMPTS = 800; // 800ms minimum entre les tentatives
    
    if (timeSinceLastAttempt < MIN_TIME_BETWEEN_ATTEMPTS) {
      console.log("Tentatives trop rapprochées, attendre un moment");
      toast.warning("Veuillez attendre un moment avant de réessayer");
      return Promise.reject(new Error("Too many attempts too quickly"));
    }
    
    // Vérifier le nombre de tentatives récentes
    if (loginAttemptCount >= 5) {
      console.log("Trop de tentatives de connexion, veuillez réessayer plus tard");
      toast.error("Trop de tentatives de connexion, veuillez réessayer plus tard");
      
      // Reset des tentatives après un délai
      setTimeout(() => {
        setLoginAttemptCount(0);
      }, 30000); // 30 secondes
      
      return Promise.reject(new Error("Too many login attempts"));
    }
    
    try {
      console.log("Tentative de connexion pour:", email, "avec remember me:", rememberMe);
      setIsAuthActionInProgress(true);
      setLoading(true);
      setAuthError(null);
      setLastLoginTimestamp(now);
      setLoginAttemptCount(prev => prev + 1);
      
      // Mémoriser l'email si demandé
      if (rememberMe && email) {
        rememberUserEmail(email, true);
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Erreur de connexion:", error.message);
        toast.error(error.message);
        setAuthError(`Login failed: ${error.message}`);
        throw error;
      }

      if (data.user && data.session) {
        console.log("Connexion réussie");
        
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
            
            // Réinitialiser le compteur de tentatives
            setLoginAttemptCount(0);
            
            toast.success("Connexion réussie");
            
            // Utiliser React Router pour la navigation
            if (navigate) {
              setTimeout(() => {
                navigate('/dashboard');
              }, 100);
            }
          }
          
          return Promise.resolve(userData);
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
          
          // Réinitialiser le compteur de tentatives
          setLoginAttemptCount(0);
          
          toast.success("Connexion réussie");
          
          if (navigate) {
            setTimeout(() => {
              navigate('/dashboard');
            }, 100);
          }
          
          return Promise.resolve(basicUserInfo);
        }
      }
      
      return Promise.resolve(null);
    } catch (error) {
      console.error("Sign in error:", error);
      return Promise.reject(error);
    } finally {
      // S'assurer que ces états sont toujours réinitialisés, même en cas d'erreur
      // Utiliser setTimeout pour éviter les problèmes de concurrent mode de React
      setTimeout(() => {
        setLoading(false);
        setIsAuthActionInProgress(false);
      }, 500);
    }
  };

  // Sign out function - améliorée pour éviter les problèmes
  const signOut = async () => {
    // Prevent multiple simultaneous auth actions
    if (isAuthActionInProgress) {
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
      }, 500);
    }
  };

  // Version debounced de la fonction signIn pour éviter les appels multiples rapides
  const debouncedSignIn = debounce(signIn, 300);

  return {
    signIn: debouncedSignIn,
    signOut,
    refreshToken,
    isLoggingOut,
    loginAttemptCount
  };
};
