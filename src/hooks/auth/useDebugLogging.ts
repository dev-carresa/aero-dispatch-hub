
import { useEffect } from 'react';

export const useDebugLogging = (
  isAuthenticated,
  loading,
  user,
  session,
  isLoggingOut,
  authError
) => {
  // Debug logging
  useEffect(() => {
    console.log("Auth state updated:", {
      isAuthenticated,
      loading,
      userEmail: user?.email || 'no user',
      sessionExists: !!session,
      isLoggingOut,
      authError
    });
  }, [isAuthenticated, loading, user, session, isLoggingOut, authError]);
};
