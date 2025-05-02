
import { useUser } from './auth/useUser';
import { useAuthListeners } from './auth/useAuthListeners'; 
import { useAuthActions } from './auth/useAuthActions';
import { useDebugLogging } from './auth/useDebugLogging';

export const useAuthProvider = () => {
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

  // Set up auth listeners
  useAuthListeners(
    setUser,
    setSession,
    setIsAuthenticated,
    setLoading,
    setAuthError
  );

  // Get auth actions
  const {
    signIn,
    signOut,
    isLoggingOut
  } = useAuthActions(
    setUser,
    setSession,
    setIsAuthenticated,
    setLoading,
    setAuthError
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
