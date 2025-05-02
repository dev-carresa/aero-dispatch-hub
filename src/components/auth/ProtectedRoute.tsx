
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading, isLoggingOut, authError, user } = useAuth();
  const location = useLocation();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Show timeout message if loading takes too long
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (loading) {
      timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 3000);
    } else {
      setLoadingTimeout(false);
    }
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [loading]);
  
  // Handle auth error messages
  useEffect(() => {
    // Only show auth messages if not in process of logging out
    if (!isLoggingOut && !loading && !isAuthenticated) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      console.log("Not authenticated, redirecting to login page");
    }
    
    if (authError && !isLoggingOut && !loading) {
      toast.error(authError);
    }
  }, [isAuthenticated, loading, isLoggingOut, authError]);

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
                onClick={() => {
                  localStorage.removeItem('sb-qqfnokbhdzmffywksmvl-auth-token');
                  window.location.href = '/';
                }}
              >
                Retour à la page d'accueil
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If authenticated, render child routes, otherwise redirect to login
  return isAuthenticated && user ? 
    <Outlet /> : 
    <Navigate to="/" state={{ from: location }} replace />;
};
