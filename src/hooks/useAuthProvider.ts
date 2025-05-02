
import { useUser } from './auth/useUser';
import { useAuthListeners } from './auth/useAuthListeners'; 
import { useAuthActions } from './auth/useAuthActions';
import { useDebugLogging } from './auth/useDebugLogging';
import { clearStoredSession } from '@/services/sessionStorageService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { seedPermissionsAndRoles } from '@/services/permissionService';
import { useNavigate } from 'react-router-dom';

export const useAuthProvider = () => {
  const navigate = useNavigate();
  
  // Get state variables and setters
  const {
    user,
    setUser,
    session,
    setSession,
    loading,
    setLoading,
    isAuthenticated,
    setIsAuthenticated,
    authError,
    setAuthError
  } = useUser();

  // Get auth actions
  const {
    signIn,
    signOut,
    refreshToken,
    isLoggingOut,
    isAuthActionInProgress,
    getIsAuthActionInProgress
  } = useAuthActions(
    setUser,
    setSession,
    setIsAuthenticated,
    setLoading,
    setAuthError,
    navigate
  );

  // Set up auth listeners with refresh token function
  useAuthListeners(
    setUser,
    setSession,
    setIsAuthenticated,
    setLoading,
    refreshToken,
    setAuthError
  );

  // Function to reset session and update role_id to match role for admin
  const resetSession = async () => {
    if (!user || !session) {
      toast.error("Vous devez être connecté pour effectuer cette action");
      return Promise.resolve(false);
    }

    try {
      setLoading(true);
      toast.info("Mise à jour de votre session...");

      // 1. Find the Admin role ID
      const { data: adminRole, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'Admin')
        .single();

      if (roleError || !adminRole) {
        throw new Error("Impossible de trouver le rôle Admin");
      }

      // 2. Update the user's profile with the correct role_id
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          role_id: adminRole.id,
          role: 'Admin'  // Ensure both fields are consistent
        })
        .eq('id', user.id);

      if (updateError) {
        throw new Error("Échec de la mise à jour du rôle: " + updateError.message);
      }

      // 3. Seed permissions and roles to ensure everything is set up correctly
      const seedResult = await seedPermissionsAndRoles();
      
      if (!seedResult.success) {
        throw new Error("Échec de la mise à jour des permissions");
      }

      // 4. Refresh the Supabase auth session
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw new Error("Échec du rafraîchissement de la session: " + error.message);
      }

      // Update state with the refreshed session
      setSession(data.session);
      
      // Force page reload to refresh all states and contexts
      toast.success("Session mise à jour avec succès. Rechargement de l'application...");
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      return Promise.resolve(true);
    } catch (error) {
      console.error("Erreur lors de la réinitialisation de la session:", error);
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`);
      return Promise.resolve(false);
    } finally {
      setLoading(false);
    }
  };

  // Debug logging for auth state (in development)
  useDebugLogging(user, session, isAuthenticated, loading);

  return {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAuthenticated,
    isLoggingOut,
    authError,
    isAuthActionInProgress,
    resetSession
  };
};
