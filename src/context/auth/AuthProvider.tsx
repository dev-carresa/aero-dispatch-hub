
import React from 'react';
import { AuthContext } from "./AuthContext";
import { useAuthState } from "./hooks/useAuthState";
import { useAuthMethods } from "./hooks/useAuthMethods";
import { Spinner } from "@/components/ui/spinner";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user, 
    session, 
    loading, 
    isAuthenticated,
    setUser,
    setSession,
    setLoading,
    setIsAuthenticated
  } = useAuthState();

  const { signIn, signOut } = useAuthMethods({
    setUser,
    setSession,
    setIsAuthenticated,
    setLoading
  });

  // Show a simpler loading state during initialization
  if (loading && !user && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="md" />
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isAuthenticated, session }}>
      {children}
    </AuthContext.Provider>
  );
};
