
import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthenticationCheck } from './AuthenticationCheck';
import { AuthRedirect } from './AuthRedirect';
import { hasStoredSession, isSessionValid } from '@/services/sessionStorageService';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Fast check for token existence and validity
  useEffect(() => {
    // Fast path: check if we don't have a token or if the token is invalid
    if (!hasStoredSession() || !isSessionValid()) {
      // Immediate redirection if no token or invalid token
      const redirectTimer = setTimeout(() => {
        navigate('/', { state: { from: location }, replace: true });
      }, 10); // Slight delay to allow for React state updates
      
      return () => clearTimeout(redirectTimer);
    }
  }, [location, navigate]);

  // If still loading, show AuthenticationCheck which handles the loading state
  if (loading) {
    return <AuthenticationCheck><Outlet /></AuthenticationCheck>;
  }

  // If not authenticated and not loading, redirect to login using React Router's Navigate
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return (
    <AuthRedirect>
      <Outlet />
    </AuthRedirect>
  );
};
