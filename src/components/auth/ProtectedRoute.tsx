import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';
import { usePermission } from '@/context/permissions';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { hasPermission } = usePermission();
  const location = useLocation();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Set a timeout for loading to show a different UI if it takes too long
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (loading) {
      timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 3000); // Show extended loading UI after 3 seconds
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading]);
  
  // If still loading, show a loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <Spinner size={loadingTimeout ? "lg" : "md"} />
          
          {loadingTimeout ? (
            <>
              <p className="text-sm text-muted-foreground">Taking longer than expected...</p>
              <div className="w-full space-y-4">
                <Skeleton className="h-8 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Verifying authentication...</p>
          )}
        </div>
      </div>
    );
  }
  
  // If not authenticated and not loading, redirect to login
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    // Show toast notification when redirecting to login
    toast.error("You must be logged in to access this page");
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // If authenticated, render the protected route
  console.log("User authenticated, rendering protected route");
  return <Outlet />;
};
