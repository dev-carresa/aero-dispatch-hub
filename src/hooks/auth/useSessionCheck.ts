
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { mapUserData } from './useUser';
import { hasStoredSession, isSessionValid } from '@/services/sessionStorageService';

export const useSessionCheck = (
  setUser,
  setSession,
  setIsAuthenticated,
  setLoading,
  setAuthError,
  pendingAuthCheck,
  isInitializing
) => {
  useEffect(() => {
    // Si aucune session valide n'a été trouvée dans localStorage, vérifier avec Supabase
    if (!hasStoredSession() || !isSessionValid()) {
      console.log("Aucune session valide dans localStorage, vérification avec Supabase");
      
      let mounted = true;
      
      const checkSession = async () => {
        try {
          // Obtenir la session depuis Supabase
          const { data: { session: initialSession }, error } = await supabase.auth.getSession();
          
          if (!mounted) return;
          
          if (error) {
            console.error("Erreur lors de la récupération de la session:", error);
            setAuthError(error.message);
            setIsAuthenticated(false);
            setLoading(false);
            return;
          }
          
          if (initialSession) {
            // Mettre à jour la session et l'état d'authentification
            setSession(initialSession);
            setIsAuthenticated(true);
            
            try {
              const userData = await mapUserData(initialSession.user);
              if (mounted) {
                setUser(userData);
                console.log("Session trouvée:", initialSession?.user.email);
              }
            } catch (err) {
              if (mounted && initialSession?.user) {
                const basicUserData = {
                  id: initialSession.user.id,
                  email: initialSession.user.email || '',
                  name: initialSession.user.email?.split('@')[0] || 'User',
                  role: 'Customer'
                };
                setUser(basicUserData);
              }
            } finally {
              if (mounted) {
                setLoading(false);
              }
            }
          } else {
            console.log("Aucune session trouvée auprès de Supabase");
            setIsAuthenticated(false);
            setLoading(false);
          }
        } catch (err) {
          console.error("Erreur inattendue lors de la vérification de la session:", err);
          if (mounted) {
            setAuthError(`Authentication error: ${err instanceof Error ? err.message : String(err)}`);
            setLoading(false);
          }
        } finally {
          if (mounted) {
            isInitializing.current = false;
          }
        }
      };
      
      // Vérification avec un court délai pour éviter les blocages
      pendingAuthCheck.current = setTimeout(checkSession, 10);
      
      return () => {
        mounted = false;
        if (pendingAuthCheck.current) {
          clearTimeout(pendingAuthCheck.current);
        }
      };
    } else {
      // Pas de vérification nécessaire, terminer le chargement
      setLoading(false);
      isInitializing.current = false;
    }
  }, [setUser, setSession, setIsAuthenticated, setLoading, setAuthError, pendingAuthCheck, isInitializing]);
};
