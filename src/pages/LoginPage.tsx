
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ensureDemoUserExists } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/login/LoginForm";
import { DemoLoginButton } from "@/components/login/DemoLoginButton";
import { LoginDivider } from "@/components/login/LoginDivider";
import { Button } from "@/components/ui/button";
import { clearUserSession } from "@/services/sessionStorageService";
import { RefreshCcw } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, loading, isAuthenticated, authError, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  // Handle redirection after authentication with useEffect
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Utilisateur authentifié, redirection vers le tableau de bord");
      // For now, redirect all users to the dashboard
      // In a more sophisticated app, you might want different destinations based on role
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Handle authentication errors
  useEffect(() => {
    if (authError) {
      setLoginError(authError);
      setIsSubmitting(false);
    }
  }, [authError]);

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    // Reset errors
    setLoginError("");
    setIsSubmitting(true);
    
    try {
      console.log("Tentative de connexion...");
      await signIn(email, password, rememberMe);
      // Note: No need to manually navigate as the signIn function will handle it if successful
    } catch (error) {
      console.error("Erreur de connexion:", error);
      
      // Handle different error types
      if (error instanceof Error) {
        if (error.message === "Authentication already in progress") {
          setLoginError("Une connexion est déjà en cours, veuillez patienter");
        } else if (error.message === "Too many login attempts") {
          setLoginError("Trop de tentatives de connexion, veuillez réessayer plus tard");
        } else if (error.message === "Too many attempts too quickly") {
          setLoginError("Veuillez attendre un moment avant de réessayer");
        } else {
          setLoginError(error.message);
        }
      }
    } finally {
      // Reset submission state after a delay
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };
  
  const handleDemoLogin = async () => {
    setLoginError("");
    setIsSubmitting(true);
    
    try {
      // Create demo user if it doesn't exist
      await ensureDemoUserExists();
      
      // Login with demo credentials
      await signIn("admin@example.com", "password", true);
    } catch (error) {
      console.error("Erreur lors de la connexion démo:", error);
      
      // Handle different error types
      if (error instanceof Error) {
        if (error.message === "Authentication already in progress") {
          setLoginError("Une connexion est déjà en cours, veuillez patienter");
        } else {
          setLoginError("Une erreur est survenue lors de la connexion avec le compte de démonstration");
        }
      }
    } finally {
      // Reset submission state after a delay
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  // Fonction pour réinitialiser la session
  const handleResetSession = () => {
    clearUserSession();
    localStorage.clear(); // Nettoyage complet du localStorage
    toast.success("Session réinitialisée avec succès");
    window.location.reload(); // Recharger la page pour réinitialiser l'état React
  };

  // Determine if button should be disabled
  const isButtonDisabled = loading || isSubmitting;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Connexion Utilisateur</CardTitle>
          <CardDescription>
            Entrez vos identifiants pour accéder à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm 
            onSubmit={handleLogin}
            isButtonDisabled={isButtonDisabled}
            loginError={loginError}
            variant="standard"
          />
          
          <LoginDivider />
          
          <DemoLoginButton 
            onClick={handleDemoLogin}
            isButtonDisabled={isButtonDisabled}
          />
          
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResetSession} 
              className="text-xs"
            >
              <RefreshCcw className="mr-1 h-3 w-3" /> Réinitialiser la session
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-center flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte? Contactez votre administrateur
          </p>
          <p className="text-sm">
            <a href="/admin" className="text-primary hover:underline">
              Accès administrateur
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
