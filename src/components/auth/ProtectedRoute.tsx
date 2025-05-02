
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading, isLoggingOut, user, authError } = useAuth();
  const location = useLocation();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Set a timeout for loading to show a different UI after 5 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (loading) {
      timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000);
    } else {
      setLoadingTimeout(false);
    }
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [loading]);
  
  // Don't show any authentication messages if we're in the process of logging out
  const shouldShowAuthMessages = !isLoggingOut;
  
  // Show loading indicator during authentication check
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Spinner size="lg" className="mb-4" />
        <p className="text-muted-foreground mb-2">Vérification de l'authentification...</p>
        
        {loadingTimeout && (
          <div className="mt-6 max-w-md">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertTitle>Temps d'attente dépassé</AlertTitle>
              <AlertDescription>
                La vérification de l'authentification prend plus de temps que prévu. 
                Cela peut être dû à des problèmes de réseau ou de connexion avec le serveur.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => window.location.reload()}
              >
                <RefreshCcw className="h-4 w-4 mr-2" /> Actualiser la page
              </Button>
              
              <Button 
                variant="default" 
                className="w-full" 
                onClick={() => window.location.href = '/'}
              >
                Retour à la page d'accueil
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Only show the error toast when we're certain user is not authenticated
  // and only once (when the component mounts)
  // and not during logout process
  useEffect(() => {
    if (!loading && !isAuthenticated && shouldShowAuthMessages) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      console.log("Not authenticated, redirecting to login page");
    }
    
    if (authError && shouldShowAuthMessages) {
      toast.error(authError);
    }
  }, [isAuthenticated, loading, shouldShowAuthMessages, authError]);

  // If authenticated, render the child routes
  // If not authenticated, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />;
};
