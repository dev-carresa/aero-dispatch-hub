
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading, isLoggingOut } = useAuth();
  const location = useLocation();
  
  // Don't show any authentication messages if we're in the process of logging out
  const shouldShowAuthMessages = !isLoggingOut;
  
  // Show loading indicator during authentication check
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spinner size="lg" className="mb-4" />
        <p className="text-muted-foreground">Vérification de l'authentification...</p>
      </div>
    );
  }

  // Only show the error toast when we're certain user is not authenticated
  // and only once (when the component mounts)
  // and not during logout process
  useEffect(() => {
    if (!loading && !isAuthenticated && shouldShowAuthMessages) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      console.log("Not authenticated, redirecting to login page");
    }
  }, [isAuthenticated, loading, shouldShowAuthMessages]);

  // If authenticated, render the child routes
  // If not authenticated, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />;
};
