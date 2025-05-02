
import { useRef } from 'react';
import { useSessionInit } from './useSessionInit';
import { useAuthStateChange } from './useAuthStateChange';
import { useSessionCheck } from './useSessionCheck';

export const useAuthListeners = (
  setUser,
  setSession,
  setIsAuthenticated,
  setLoading,
  setAuthError,
  refreshToken
) => {
  // Use refs to track initialization state
  const isInitializing = useRef(true);
  
  // Initialize session based on stored data
  useSessionInit(
    setUser,
    setSession,
    setIsAuthenticated,
    setLoading,
    refreshToken
  );

  // Set up auth state change listener
  const { pendingAuthCheck, authSubscriptionRef } = useAuthStateChange(
    setUser,
    setSession,
    setIsAuthenticated,
    setLoading
  );

  // Explicitly check session if needed
  useSessionCheck(
    setUser,
    setSession,
    setIsAuthenticated,
    setLoading,
    setAuthError,
    pendingAuthCheck,
    isInitializing
  );
};
