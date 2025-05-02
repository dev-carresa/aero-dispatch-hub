
import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const toastShown = useRef(false);

  // Show toast when user is not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated && !toastShown.current) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      console.log("Not authenticated, redirecting to login page");
      toastShown.current = true;
    }
    
    // Reset the toast flag when location or auth state changes
    return () => {
      if (location.pathname !== '/dashboard') {
        toastShown.current = false;
      }
    };
  }, [isAuthenticated, loading, location.pathname]);

  // If authenticated, render children, otherwise redirect to login
  return (isAuthenticated && user) ? (
    <>{children}</> 
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};
