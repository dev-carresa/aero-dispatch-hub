
import { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { useSignIn } from './useSignIn';
import { useSignOut } from './useSignOut';
import { useTokenRefresh } from './useTokenRefresh';

export const useAuthActions = (
  setUser,
  setSession,
  setIsAuthenticated,
  setLoading,
  setAuthError,
  navigate?: NavigateFunction
) => {
  const [isAuthActionInProgress, setIsAuthActionInProgress] = useState(false);
  
  // Créer une fonction qui permet à la fois de lire et de définir l'état
  const getIsAuthActionInProgress = (setValue?: boolean): boolean => {
    if (setValue !== undefined) {
      setIsAuthActionInProgress(setValue);
    }
    return isAuthActionInProgress;
  };
  
  // Get token refresh functionality
  const { refreshToken } = useTokenRefresh();
  
  // Get sign-in functionality
  const { signIn, loginAttemptCount } = useSignIn(
    setUser, 
    setSession, 
    setIsAuthenticated, 
    setLoading, 
    setAuthError, 
    getIsAuthActionInProgress, 
    navigate
  );
  
  // Get sign-out functionality
  const { signOut, isLoggingOut } = useSignOut(
    setUser, 
    setSession, 
    setIsAuthenticated, 
    setLoading, 
    getIsAuthActionInProgress, 
    navigate
  );

  return {
    signIn,
    signOut,
    refreshToken,
    isLoggingOut,
    loginAttemptCount,
    isAuthActionInProgress,
    getIsAuthActionInProgress
  };
};
