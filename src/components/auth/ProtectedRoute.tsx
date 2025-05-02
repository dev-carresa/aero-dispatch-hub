import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthenticationCheck } from './AuthenticationCheck';
import { AuthRedirect } from './AuthRedirect';
import { hasStoredSession, isSessionValid, clearStoredSession } from '@/services/sessionStorageService';
import { toast } from "sonner";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [redirectTriggered, setRedirectTriggered] = useState(false);
  
  // Helper function to check if a route is an admin route
  const isAdminRoute = (path: string): boolean => {
    // Updated to match the new routing structure
    return path === '/admin' || path.startsWith('/admin/') || path.startsWith('/admin-');
  };
  
  // Fast check for token existence and validity
  useEffect(() => {
    // Fast path: check if we don't have a token or if the token is invalid
    if (!hasStoredSession() || !isSessionValid()) {
      if (redirectTriggered) return; // Prevent multiple redirects
      
      console.log('ProtectedRoute: No valid session, redirecting to login');
      setRedirectTriggered(true);
      
      // Show toast notification
      toast.error("Session expirée ou invalide. Veuillez vous reconnecter.");
      
      // Determine if the user was trying to access an admin page
      const currentPathIsAdmin = isAdminRoute(location.pathname);
      
      // Immediate redirection if no token or invalid token
      const redirectTimer = setTimeout(() => {
        navigate(currentPathIsAdmin ? '/admin/login' : '/', { state: { from: location }, replace: true });
      }, 100); // Slight delay to allow for React state updates
      
      return () => clearTimeout(redirectTimer);
    }
  }, [location, navigate, redirectTriggered]);

  // If still loading, show AuthenticationCheck which handles the loading state
  if (loading) {
    return <AuthenticationCheck><Outlet /></AuthenticationCheck>;
  }

  // If not authenticated and not loading, redirect to appropriate login page
  if (!isAuthenticated) {
    // Determine which login page to redirect to based on the route
    const currentPathIsAdmin = isAdminRoute(location.pathname);
    console.log(`ProtectedRoute: Not authenticated, redirecting to ${currentPathIsAdmin ? 'admin' : 'standard'} login`);
    return <Navigate to={currentPathIsAdmin ? "/admin/login" : "/"} state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  console.log('ProtectedRoute: Authenticated, rendering content');
  return (
    <AuthRedirect>
      <Outlet />
    </AuthRedirect>
  );
};
