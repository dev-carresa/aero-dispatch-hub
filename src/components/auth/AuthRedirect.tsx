
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show toast when user is already authenticated trying to access login pages
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      toast.info("Vous êtes déjà connecté");
      console.log("Already authenticated, redirecting to dashboard");
    }
  }, [isAuthenticated, loading, user]);

  // Don't redirect while still loading - this prevents flashing to login page
  if (loading) {
    return null;
  }

  // If authenticated, redirect to dashboard, otherwise render children
  return (isAuthenticated && user) ? (
    <Navigate to="/dashboard" state={{ from: location }} replace />
  ) : (
    <>{children}</> 
  );
};
