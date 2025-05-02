import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { mapUserData } from './useUser';
import { NavigateFunction } from 'react-router-dom';
import { debounce, AUTH_CONSTANTS } from './utils/authUtils';
import { storeSession } from '@/services/sessionStorageService';

// Add the missing rememberUserEmail function inline since it's used here
const rememberUserEmail = (email: string, remember: boolean): void => {
  if (typeof window !== 'undefined') {
    if (remember) {
      localStorage.setItem('remembered-email', email);
    } else {
      localStorage.removeItem('remembered-email');
    }
  }
};

// Add the missing storeUserSession function inline since it's used here
const storeUserSession = (
  id: string,
  email: string,
  name: string,
  role: string,
  expiresIn: number
): void => {
  if (typeof window !== 'undefined') {
    const expiryTime = Date.now() + expiresIn * 1000;
    const userData = {
      id,
      email,
      name,
      role,
      expiryTime
    };
    localStorage.setItem('user-session-data', JSON.stringify(userData));
  }
};

export const useSignIn = (
  setUser,
  setSession,
  setIsAuthenticated,
  setLoading,
  setAuthError,
  getIsAuthActionInProgress,
  navigate?: NavigateFunction
) => {
  const [loginAttemptCount, setLoginAttemptCount] = useState(0);
  const [lastLoginTimestamp, setLastLoginTimestamp] = useState(0);

  // Sign in function - améliorée pour gérer les promesses, limiter les tentatives et mieux traiter les erreurs
  const signIn = async (email: string, password: string, rememberMe: boolean = true): Promise<any> => {
    // Vérifier si une authentification est déjà en cours avec la fonction getter
    const isAuthInProgress = getIsAuthActionInProgress();
    if (isAuthInProgress) {
      console.log("Une authentification est déjà en cours, opération annulée");
      toast.error("Une connexion est déjà en cours, veuillez patienter");
      return Promise.reject(new Error("Authentication already in progress"));
    }
    
    // Vérifier le temps écoulé depuis la dernière tentative
    const now = Date.now();
    const timeSinceLastAttempt = now - lastLoginTimestamp;
    
    if (timeSinceLastAttempt < AUTH_CONSTANTS.MIN_TIME_BETWEEN_ATTEMPTS) {
      console.log("Tentatives trop rapprochées, attendre un moment");
      toast.warning("Veuillez attendre un moment avant de réessayer");
      return Promise.reject(new Error("Too many attempts too quickly"));
    }
    
    // Vérifier le nombre de tentatives récentes
    if (loginAttemptCount >= AUTH_CONSTANTS.MAX_LOGIN_ATTEMPTS) {
      console.log("Trop de tentatives de connexion, veuillez réessayer plus tard");
      toast.error("Trop de tentatives de connexion, veuillez réessayer plus tard");
      
      // Reset des tentatives après un délai
      setTimeout(() => {
        setLoginAttemptCount(0);
      }, AUTH_CONSTANTS.LOGIN_ATTEMPTS_RESET_TIME);
      
      return Promise.reject(new Error("Too many login attempts"));
    }
    
    try {
      console.log("Tentative de connexion pour:", email, "avec remember me:", rememberMe);
      setLoading(true);
      setAuthError(null);
      setLastLoginTimestamp(now);
      setLoginAttemptCount(prev => prev + 1);
      
      // Définir l'état d'authentification après les vérifications
      getIsAuthActionInProgress(true);
      
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
                if (userData.role === 'Admin') {
                  navigate('/admin/dashboard');
                } else {
                  navigate('/dashboard');
                }
              }, AUTH_CONSTANTS.NAVIGATION_DELAY);
            }
          }
          
          return userData; // Return userData to fulfill Promise
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
            }, AUTH_CONSTANTS.NAVIGATION_DELAY);
          }
          
          return basicUserInfo; // Return basicUserInfo to fulfill Promise
        }
      }
      
      return null; // Return null to fulfill Promise when no user/session
    } catch (error) {
      console.error("Sign in error:", error);
      return Promise.reject(error);
    } finally {
      // S'assurer que ces états sont toujours réinitialisés, même en cas d'erreur
      setTimeout(() => {
        setLoading(false);
        getIsAuthActionInProgress(false);
      }, AUTH_CONSTANTS.AUTH_ACTION_RESET_DELAY);
    }
  };

  // Version debounced de la fonction signIn pour éviter les appels multiples rapides
  const debouncedSignIn = debounce(async (email, password, rememberMe) => {
    return signIn(email, password, rememberMe);
  }, 300);

  return {
    signIn: debouncedSignIn,
    loginAttemptCount
  };
};
