
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // If still loading, show a loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="md" />
          <p className="text-sm text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated and not loading, redirect to login
  if (!isAuthenticated) {
    // Show toast notification when redirecting to login
    toast.error("You must be logged in to access this page");
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // If authenticated, render the protected route
  return <Outlet />;
};
