
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthenticationCheck } from './AuthenticationCheck';

interface ProtectedRouteProps {
  children: ReactNode;
  permission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  permission 
}) => {
  const { isAuthenticated, loading, hasPermission } = useAuth();
  const location = useLocation();

  // If still loading, show AuthenticationCheck which handles the loading state
  if (loading) {
    return <AuthenticationCheck>{children}</AuthenticationCheck>;
  }

  // If not authenticated and not loading, redirect to login using React Router's Navigate
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If permission is required, check if the user has it
  if (permission && !hasPermission(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};
