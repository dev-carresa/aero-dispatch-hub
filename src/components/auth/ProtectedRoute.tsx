
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading, isLoggingOut, user, authError, session } = useAuth();
  const location = useLocation();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [showAuthMessage, setShowAuthMessage] = useState(false);
  const [performingSecondaryCheck, setPerformingSecondaryCheck] = useState(false);
  const [secondaryCheckFailed, setSecondaryCheckFailed] = useState(false);
  
  // Additional security check - verify the token is still valid
  useEffect(() => {
    const verifyToken = async () => {
      // Only perform secondary check if we think we're authenticated but not loading
      if (isAuthenticated && !loading && session?.access_token && !performingSecondaryCheck) {
        try {
          setPerformingSecondaryCheck(true);
          
          // Make a lightweight call to verify the token is still valid
          const { error } = await supabase.auth.getUser();
          
          if (error) {
            console.error("Secondary token check failed:", error.message);
            setSecondaryCheckFailed(true);
            // Force logout and redirect to login
            localStorage.removeItem('sb-qqfnokbhdzmffywksmvl-auth-token');
            window.location.href = '/';
            return;
          }
          
          console.log("Secondary token verification passed");
          setSecondaryCheckFailed(false);
        } catch (err) {
          console.error("Error in secondary token verification:", err);
          setSecondaryCheckFailed(true);
        } finally {
          setPerformingSecondaryCheck(false);
        }
      }
    };
    
    verifyToken();
  }, [isAuthenticated, loading, session]);
  
  // Set a timeout for loading to show a different UI after 3 seconds (reduced from 5)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (loading) {
      timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 3000); // Reduced timeout for better UX
    } else {
      setLoadingTimeout(false);
    }
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [loading]);
  
  // Handle auth messages - separate effect to avoid conditional hook issue
  useEffect(() => {
    // Don't show any authentication messages if we're in the process of logging out
    const shouldShowAuthMessages = !isLoggingOut && !loading;
    setShowAuthMessage(shouldShowAuthMessages);
    
    // Only show the error toast when we're certain user is not authenticated
    // and only once (when the component mounts)
    if (!loading && !isAuthenticated && shouldShowAuthMessages) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      console.log("Not authenticated, redirecting to login page");
    }
    
    if (authError && shouldShowAuthMessages) {
      toast.error(authError);
    }
    
    if (secondaryCheckFailed && shouldShowAuthMessages) {
      toast.error("Votre session a expiré. Veuillez vous reconnecter.");
    }
  }, [isAuthenticated, loading, isLoggingOut, authError, secondaryCheckFailed]);

  // Show loading indicator during authentication check
  if (loading || performingSecondaryCheck) {
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
                  // Clear any stale auth data before redirecting
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

  // If authenticated and secondary check passed, render the child routes
  // If not authenticated, redirect to the login page
  return (isAuthenticated && !secondaryCheckFailed) ? 
    <Outlet /> : 
    <Navigate to="/" state={{ from: location }} replace />;
};
