
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/login/LoginForm";
import { Shield, RefreshCcw } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { clearUserSession } from "@/services/sessionStorageService";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { signIn, loading, isAuthenticated, authError, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  // Handle redirection after authentication with useEffect
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if the authenticated user is an admin
      if (user.role === 'Admin') {
        console.log("Admin authentifié, redirection vers le tableau de bord");
        navigate('/dashboard');
      } else {
        // If not admin, show error and redirect to regular login
        toast.error("Vous n'avez pas les droits d'accès administrateur");
        console.log("Utilisateur non-admin, redirection vers la page de connexion standard");
        navigate('/');
      }
    }
  }, [isAuthenticated, navigate, user]);

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
      console.log("Tentative de connexion administrateur...");
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
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-900">
      <Card className="w-full max-w-md shadow-lg border-purple-800 bg-gray-800 text-white">
        <CardHeader className="space-y-1 text-center border-b border-gray-700 pb-6">
          <div className="flex justify-center mb-2">
            <Shield className="h-12 w-12 text-purple-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Administration</CardTitle>
          <CardDescription className="text-gray-300">
            Connexion au panneau d'administration
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <LoginForm 
            onSubmit={handleLogin}
            isButtonDisabled={isButtonDisabled}
            loginError={loginError}
            variant="admin"
          />
          
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResetSession} 
              className="text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600"
            >
              <RefreshCcw className="mr-1 h-3 w-3" /> Réinitialiser la session
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-center border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-400">
            <a href="/" className="text-purple-400 hover:underline">Connexion utilisateur standard</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
