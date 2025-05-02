
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Show a better loading indicator during authentication check
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spinner size="lg" className="mb-4" />
        <p className="text-muted-foreground">Verifying authentication...</p>
      </div>
    );
  }

  // Only show the error toast when we're certain user is not authenticated
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("You must be logged in to access this page");
    }
  }, [isAuthenticated, loading]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />;
};
