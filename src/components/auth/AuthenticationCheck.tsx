import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hasStoredSession, isSessionValid, getStoredUserData, clearStoredSession } from '@/services/sessionStorageService';
import { useNavigate } from 'react-router-dom';

export const AuthenticationCheck: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { loading, isLoggingOut, authError } = useAuth();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [showQuickLoading, setShowQuickLoading] = useState(true);
  const [authRetries, setAuthRetries] = useState(0);
  const navigate = useNavigate();
  
  // Vérification initiale optimisée
  useEffect(() => {
    const hasToken = hasStoredSession();
    const tokenIsValid = isSessionValid();
    const userData = getStoredUserData();
    
    console.log("AuthenticationCheck: Vérification initiale", { hasToken, tokenIsValid, hasUserData: !!userData });
    
    // Fast path: si nous avons un token valide et des données utilisateur, afficher le contenu
    if (hasToken && tokenIsValid && userData) {
      setShowQuickLoading(true);
    } else {
      setShowQuickLoading(false);
      
      // Si pas de token ou token invalide, rediriger vers la page d'accueil
      if (!hasToken || !tokenIsValid) {
        console.log("AuthenticationCheck: Token invalide ou absent, redirection");
        toast.error("Votre session a expiré. Veuillez vous reconnecter.");
        
        // Nettoyer les données de session périmées
        if (hasToken && !tokenIsValid) {
          clearStoredSession();
        }
        
        const redirectTimer = setTimeout(() => {
          navigate('/');
        }, 100);
        
        return () => clearTimeout(redirectTimer);
      }
    }
  }, [navigate]);
  
  // Show timeout message if loading takes too long
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (loading) {
      timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
        setAuthRetries(prev => prev + 1);
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

  // Reset après trop de tentatives
  useEffect(() => {
    if (authRetries >= 3) {
      toast.error("Problème de connexion persistant. Réinitialisation de la session.");
      clearStoredSession();
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  }, [authRetries]);

  // Si nous pensons être authentifiés en fonction du token localStorage,
  // afficher un rendu rapide pour éviter les scintillements
  if (showQuickLoading && hasStoredSession() && isSessionValid()) {
    // Après 100 ms, commencer à afficher le spinner de chargement si nous chargeons toujours
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
      
      {loadingTimeout && <LoadingTimeoutAlert authRetries={authRetries} />}
    </div>
  );
};

interface LoadingTimeoutAlertProps {
  authRetries: number;
}

const LoadingTimeoutAlert: React.FC<LoadingTimeoutAlertProps> = ({ authRetries }) => {
  return (
    <div className="mt-6 max-w-md">
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertTitle>Temps d'attente dépassé</AlertTitle>
        <AlertDescription>
          La vérification de l'authentification prend plus de temps que prévu. 
          Cela peut être dû à des problèmes de réseau ou de connexion avec le serveur.
          {authRetries > 1 && " Plusieurs tentatives infructueuses."}
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
            localStorage.removeItem('user-session-data');
            localStorage.removeItem('login-attempts');
            window.location.href = '/';
          }}
        >
          Réinitialiser et retourner à la page d'accueil
        </Button>
      </div>
    </div>
  );
};
