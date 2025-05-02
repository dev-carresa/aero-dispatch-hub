
import { NavigateFunction } from 'react-router-dom';
import { useUser } from './auth/useUser';
import { useAuthListeners } from './auth/useAuthListeners'; 
import { useAuthActions } from './auth/useAuthActions';
import { useDebugLogging } from './auth/useDebugLogging';
import { clearUserSession } from '@/services/sessionStorageService';
import { toast } from 'sonner';

export const useAuthProvider = (navigate?: NavigateFunction) => {
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
    setAuthError,
    refreshToken
  );

  // Set up debug logging
  useDebugLogging(
    isAuthenticated,
    loading,
    user,
    session,
    isLoggingOut,
    authError
  );

  // Function to reset session state
  const resetSession = () => {
    clearUserSession();
    localStorage.clear(); // Nettoyage complet du localStorage
    toast.success("Session réinitialisée avec succès");
    window.location.reload(); // Recharger la page pour réinitialiser l'état React
  };

  return {
    user,
    loading,
    signIn, 
    signOut,
    isAuthenticated,
    session,
    isLoggingOut,
    authError,
    isAuthActionInProgress,
    resetSession
  };
};
