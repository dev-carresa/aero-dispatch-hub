
import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { mapUserData, clearUserProfileCache } from './useUser';

export const useAuthStateChange = (
  setUser,
  setSession,
  setIsAuthenticated,
  setLoading
) => {
  // Use ref to track initialization state and prevent duplicate processing
  const pendingAuthCheck = useRef<NodeJS.Timeout | null>(null);
  const authSubscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  
  useEffect(() => {
    console.log("Mise en place des écouteurs d'authentification");
    let mounted = true;
    
    // Set up auth state change listener
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
  }, [setUser, setSession, setIsAuthenticated, setLoading]);
  
  return { pendingAuthCheck, authSubscriptionRef };
};
