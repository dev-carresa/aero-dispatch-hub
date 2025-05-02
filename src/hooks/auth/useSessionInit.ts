
import { useEffect, useRef } from 'react';
import { 
  hasStoredSession
} from '@/services/sessionStorageService';
import { supabase } from "@/integrations/supabase/client";

// Add the missing functions here
const isSessionValid = (): boolean => {
  const sessionStr = localStorage.getItem('supabase.auth.session');
  if (!sessionStr) return false;
  
  const session = JSON.parse(sessionStr);
  if (!session.expires_at) return false;
  
  return session.expires_at * 1000 > Date.now();
};

const getStoredUserData = () => {
  const userDataStr = localStorage.getItem('user-session-data');
  if (!userDataStr) return null;
  
  return JSON.parse(userDataStr);
};

const shouldRefreshToken = (): boolean => {
  const sessionStr = localStorage.getItem('supabase.auth.session');
  if (!sessionStr) return false;
  
  const session = JSON.parse(sessionStr);
  if (!session.expires_at) return false;
  
  // Refresh if less than 5 minutes remaining (300 seconds)
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const fiveMinutesBeforeExpiry = session.expires_at - 300;
  
  return nowInSeconds >= fiveMinutesBeforeExpiry;
};

export const useSessionInit = (
  setUser,
  setSession,
  setIsAuthenticated,
  setLoading,
  refreshToken
) => {
  useEffect(() => {
    // Fast path: check if we have a valid session in localStorage
    const hasToken = hasStoredSession();
    const isValid = isSessionValid();
    
    if (hasToken && isValid) {
      // Charger les données utilisateur depuis le stockage local
      const userData = getStoredUserData();
      
      if (userData) {
        console.log("Données utilisateur valides trouvées en localStorage");
        setUser({
          id: userData.id,
          email: userData.email || '',
          name: userData.name || 'User',
          role: userData.role || 'Customer'
        });
        setIsAuthenticated(true);
        
        // Déclencher la récupération complète de la session en arrière-plan
        setTimeout(() => {
          supabase.auth.getSession().then(({ data }) => {
            if (data?.session) {
              setSession(data.session);
            }
          });
        }, 0);
      } else {
        console.log("Token présent mais données utilisateur incomplètes");
      }
    } 
    else if (!hasToken || !isValid) {
      // Si pas de token ou token invalide, définir comme non authentifié
      console.log("Pas de token ou token invalide en localStorage");
      setIsAuthenticated(false);
      setLoading(false);
    }
    
    // Vérifier si nous devons rafraîchir le token
    if (hasToken && shouldRefreshToken()) {
      console.log("Le token doit être rafraîchi");
      // Utiliser un timeout pour éviter les problèmes de récursivité
      setTimeout(() => {
        refreshToken();
      }, 0);
    }
  }, [setUser, setIsAuthenticated, setLoading, refreshToken, setSession]);
};
