
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthenticationCheck } from './AuthenticationCheck';
import { AuthRedirect } from './AuthRedirect';
import { hasStoredSession, isSessionValid } from '@/services/sessionStorageService';
import { toast } from "sonner";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [redirectTriggered, setRedirectTriggered] = useState(false);
  
  // Fast check for token existence and validity
  useEffect(() => {
    // Fast path: check if we don't have a token or if the token is invalid
    if (!hasStoredSession() || !isSessionValid()) {
      if (redirectTriggered) return; // Prevent multiple redirects
      
      console.log('ProtectedRoute: No valid session, redirecting to login');
      setRedirectTriggered(true);
      
      // Show toast notification
      toast.error("Session expirée ou invalide. Veuillez vous reconnecter.");
      
      // Immediate redirection if no token or invalid token
      const redirectTimer = setTimeout(() => {
        navigate('/', { state: { from: location }, replace: true });
      }, 100); // Slight delay to allow for React state updates
      
      return () => clearTimeout(redirectTimer);
    }
  }, [location, navigate, redirectTriggered]);

  // If still loading, show AuthenticationCheck which handles the loading state
  if (loading) {
    return <AuthenticationCheck><Outlet /></AuthenticationCheck>;
  }

  // If not authenticated and not loading, redirect to login using React Router's Navigate
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  console.log('ProtectedRoute: Authenticated, rendering content');
  return (
    <AuthRedirect>
      <Outlet />
    </AuthRedirect>
  );
};
