
import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { mapUserData, clearUserProfileCache } from './useUser';
import { 
  hasStoredSession, 
  isSessionValid, 
  getStoredUserData,
  shouldRefreshToken 
} from '@/services/sessionStorageService';

export const useAuthListeners = (
  setUser,
  setSession,
  setIsAuthenticated,
  setLoading,
  setAuthError,
  refreshToken
) => {
  // Use refs to track initialization state and prevent duplicate processing
  const isInitializing = useRef(true);
  const pendingAuthCheck = useRef<NodeJS.Timeout | null>(null);
  const authSubscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  
  // Set initial authentication state based on stored session
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

  // Initialize auth state and set up listeners
  useEffect(() => {
    console.log("Mise en place des écouteurs d'authentification");
    let mounted = true;
    
    // First set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Changement d'état d'authentification:", event);
        
        // Clear any pending auth checks
        if (pendingAuthCheck.current) {
          clearTimeout(pendingAuthCheck.current);
          pendingAuthCheck.current = null;
        }
        
        if (!mounted) return;
        
        // Handle sign out event immediately
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          setLoading(false);
          clearUserProfileCache();
          console.log("Déconnecté avec succès");
          return;
        }
        
        // Pour tous les autres événements, si nous avons une session, mettre à jour l'état d'authentification
        if (currentSession) {
          // Mettre à jour la session et l'état d'authentification immédiatement
          setSession(currentSession);
          setIsAuthenticated(true);
          
          try {
            // Obtenir les données utilisateur de manière asynchrone
            const userData = await mapUserData(currentSession.user);
            if (mounted) {
              setUser(userData);
              console.log("Utilisateur authentifié:", userData?.email);
              setLoading(false);
            }
          } catch (err) {
            console.error("Erreur non fatale lors de la récupération des données utilisateur:", err);
            // Ne pas réinitialiser l'état d'authentification en cas d'échec de la récupération du profil
            // Utiliser simplement les données utilisateur de base de la session
            if (mounted && currentSession?.user) {
              const basicUserData = {
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                name: currentSession.user.email?.split('@')[0] || 'User',
                role: 'Customer'
              };
              setUser(basicUserData);
              setLoading(false);
            }
          }
        } else if (event !== 'TOKEN_REFRESHED') {
          // Pas de session et pas simplement de rafraîchissement de token
          if (mounted) {
            setIsAuthenticated(false);
            setLoading(false);
          }
        }
      }
    );
    
    // Store the subscription for cleanup
    authSubscriptionRef.current = subscription;

    // Si aucune session valide n'a été trouvée dans localStorage, vérifier avec Supabase
    if (!hasStoredSession() || !isSessionValid()) {
      console.log("Aucune session valide dans localStorage, vérification avec Supabase");
      
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
    } else {
      // Pas de vérification nécessaire, terminer le chargement
      setLoading(false);
      isInitializing.current = false;
    }

    // Cleanup function
    return () => {
      mounted = false;
      if (pendingAuthCheck.current) {
        clearTimeout(pendingAuthCheck.current);
      }
      if (authSubscriptionRef.current) {
        authSubscriptionRef.current.unsubscribe();
      }
    };
  }, [setUser, setSession, setIsAuthenticated, setLoading, setAuthError, refreshToken]);
};
