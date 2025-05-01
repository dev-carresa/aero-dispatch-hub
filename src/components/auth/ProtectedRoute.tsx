
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';
import { usePermission } from '@/context/permissions';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCwIcon } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading, authError, forceResetLoading } = useAuth();
  const { 
    hasPermission, 
    loadingPermissions, 
    permissionError,
    forceResetPermissionsLoading,
    userPermissions
  } = usePermission();
  const location = useLocation();
  const navigate = useNavigate();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [criticalTimeout, setCriticalTimeout] = useState(false);
  
  // Set a timeout for loading to show a different UI if it takes too long
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let criticalTimeoutId: NodeJS.Timeout | null = null;
    
    if (loading || loadingPermissions) {
      // Show extended loading UI after 3 seconds
      timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 3000); 
      
      // Show critical timeout UI after 10 seconds
      criticalTimeoutId = setTimeout(() => {
        setCriticalTimeout(true);
      }, 10000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (criticalTimeoutId) clearTimeout(criticalTimeoutId);
    };
  }, [loading, loadingPermissions]);

  // Force continue function - use with caution
  const handleForceContinue = () => {
    // Force reset loading states
    if (forceResetLoading) forceResetLoading();
    if (forceResetPermissionsLoading) forceResetPermissionsLoading();
    
    // Force navigation to the requested page
    toast.warning("Bypassing authentication checks - some features may not work", {
      duration: 5000,
    });
    
    // Clear timeout states
    setLoadingTimeout(false);
    setCriticalTimeout(false);
  };

  // If still loading, show a loading state
  if (loading || loadingPermissions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <Spinner size={loadingTimeout ? "lg" : "md"} />
          
          {criticalTimeout ? (
            <>
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Authentication Problem</AlertTitle>
                <AlertDescription className="mb-4">
                  Authentication is taking too long. This might be due to a server issue or permission problems.
                </AlertDescription>
                
                <div className="flex flex-col gap-2 mt-2">
                  <Button
                    variant="outline" 
                    className="w-full"
                    onClick={handleForceContinue}
                  >
                    <RefreshCwIcon className="mr-2 h-4 w-4" />
                    Continue Anyway
                  </Button>
                  
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => window.location.href = "/"}
                  >
                    Return to Login
                  </Button>
                </div>
              </Alert>
              
              <div className="text-sm text-muted-foreground mt-2">
                <p>Debug info:</p>
                <ul className="list-disc pl-5">
                  <li>Auth loading: {loading ? "Yes" : "No"}</li>
                  <li>Auth error: {authError || "None"}</li>
                  <li>Permissions loading: {loadingPermissions ? "Yes" : "No"}</li>
                  <li>Permissions error: {permissionError || "None"}</li>
                  <li>User permissions count: {userPermissions?.length || 0}</li>
                </ul>
              </div>
            </>
          ) : loadingTimeout ? (
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
            <p className="text-sm text-muted-foreground">
              {loading ? "Verifying authentication..." : "Loading permissions..."}
            </p>
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
