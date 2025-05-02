
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hasStoredSession } from '@/hooks/auth/useUser';

export const AuthenticationCheck: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { loading, isLoggingOut, authError } = useAuth();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [showQuickLoading, setShowQuickLoading] = useState(true);
  
  // Initially check if we have a token in local storage
  useEffect(() => {
    const hasToken = hasStoredSession();
    // If we have a token, show quick loading first to prevent flicker
    setShowQuickLoading(hasToken);
  }, []);
  
  // Show timeout message if loading takes too long
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (loading) {
      timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 8000); // Increased timeout to 8 seconds
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
    if (!isLoggingOut && !loading && authError) {
      toast.error(authError);
    }
  }, [loading, isLoggingOut, authError]);

  // If we think we're authenticated based on localStorage token,
  // show a fast-path render to avoid flicker
  if (showQuickLoading && hasStoredSession()) {
    // After 100ms, start showing the loading spinner if we're still loading
    setTimeout(() => setShowQuickLoading(false), 100);
    return <>{children}</>; // Fast path - render children immediately
  }

  if (!loading) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Spinner size="lg" className="mb-4" />
      <p className="text-muted-foreground mb-2">Vérification de l'authentification...</p>
      
      {loadingTimeout && <LoadingTimeoutAlert />}
    </div>
  );
};

const LoadingTimeoutAlert: React.FC = () => {
  return (
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
  );
};
