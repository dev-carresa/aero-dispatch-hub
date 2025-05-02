
import { useEffect, useRef } from 'react';
import { 
  hasStoredSession, 
  isSessionValid, 
  getStoredUserData,
  shouldRefreshToken 
} from '@/services/sessionStorageService';
import { supabase } from "@/integrations/supabase/client";

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
