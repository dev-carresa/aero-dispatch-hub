
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthenticationCheck } from './AuthenticationCheck';
import { AuthRedirect } from './AuthRedirect';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // If still loading, show AuthenticationCheck which handles the loading state
  if (loading) {
    return <AuthenticationCheck><Outlet /></AuthenticationCheck>;
  }

  // If not authenticated and not loading, redirect to login
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
