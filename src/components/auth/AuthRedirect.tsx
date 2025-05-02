
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show toast when user is not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      console.log("Not authenticated, redirecting to login page");
    }
  }, [isAuthenticated, loading]);

  // If authenticated, render children, otherwise redirect to login
  return (isAuthenticated && user) ? (
    <>{children}</> 
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};
