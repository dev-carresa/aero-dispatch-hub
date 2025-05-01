
import React from 'react';
import { AuthContext } from "./AuthContext";
import { useAuthState } from "./hooks/useAuthState";
import { useAuthMethods } from "./hooks/useAuthMethods";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user, 
    session, 
    loading, 
    isAuthenticated,
    authError,
    setUser,
    setSession,
    setLoading,
    setIsAuthenticated,
    forceResetLoading
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
        <div className="flex flex-col items-center gap-4 max-w-md">
          <Spinner size="md" />
          <p className="text-muted-foreground">Loading authentication...</p>
          
          {authError && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={forceResetLoading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Continue Anyway
              </Button>
            </Alert>
          )}
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signOut, 
      isAuthenticated, 
      session,
      authError,
      forceResetLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
