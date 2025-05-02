
import { NavigateFunction } from 'react-router-dom';
import { useUser } from './auth/useUser';
import { useAuthListeners } from './auth/useAuthListeners'; 
import { useAuthActions } from './auth/useAuthActions';
import { useDebugLogging } from './auth/useDebugLogging';

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
    isLoggingOut
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

  return {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated,
    session,
    isLoggingOut,
    authError
  };
};
