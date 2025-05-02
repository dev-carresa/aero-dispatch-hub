
import { useState } from 'react';
import { NavigateFunction, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
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

  // Wrapper function to pass current path to signOut
  const handleSignOut = async (currentPath?: string): Promise<void> => {
    await signOut(currentPath || location.pathname);
  };

  return {
    signIn,
    signOut: handleSignOut,
    refreshToken,
    isLoggingOut,
    loginAttemptCount,
    isAuthActionInProgress,
    getIsAuthActionInProgress
  };
};
