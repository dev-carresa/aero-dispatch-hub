
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
  
  // Get token refresh functionality
  const { refreshToken } = useTokenRefresh();
  
  // Get sign-in functionality
  const { signIn, loginAttemptCount } = useSignIn(
    setUser, 
    setSession, 
    setIsAuthenticated, 
    setLoading, 
    setAuthError, 
    () => isAuthActionInProgress, 
    navigate
  );
  
  // Get sign-out functionality
  const { signOut, isLoggingOut } = useSignOut(
    setUser, 
    setSession, 
    setIsAuthenticated, 
    setLoading, 
    () => isAuthActionInProgress, 
    navigate
  );

  return {
    signIn,
    signOut,
    refreshToken,
    isLoggingOut,
    loginAttemptCount
  };
};
