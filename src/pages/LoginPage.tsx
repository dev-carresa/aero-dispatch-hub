
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ensureDemoUserExists } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { getRememberedEmail } from "@/services/sessionStorageService";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, loading, isAuthenticated, authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  // Charger l'email mémorisé lors du chargement de la page
  useEffect(() => {
    const savedEmail = getRememberedEmail();
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // Gérer la redirection après authentification avec useEffect
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Utilisateur authentifié, redirection vers le tableau de bord");
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Effet pour gérer les erreurs d'authentification
  useEffect(() => {
    if (authError) {
      setLoginError(authError);
      setIsSubmitting(false);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier les champs
    if (!email || !password) {
      setLoginError("Veuillez remplir tous les champs");
      return;
    }
    
    // Réinitialiser les erreurs
    setLoginError("");
    setIsSubmitting(true);
    
    try {
      console.log("Tentative de connexion...");
      await signIn(email, password, rememberMe);
    } catch (error) {
      console.error("Erreur de connexion:", error);
      
      // Gérer différents types d'erreurs
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
      // Réinitialiser l'état de soumission après un délai
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
      await signIn("admin@example.com", "password", rememberMe);
    } catch (error) {
      console.error("Erreur lors de la connexion démo:", error);
      
      // Gérer différents types d'erreurs
      if (error instanceof Error) {
        if (error.message === "Authentication already in progress") {
          setLoginError("Une connexion est déjà en cours, veuillez patienter");
        } else {
          setLoginError("Une erreur est survenue lors de la connexion avec le compte de démonstration");
        }
      }
    } finally {
      // Réinitialiser l'état de soumission après un délai
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  // Déterminer si le bouton doit être désactivé
  const isButtonDisabled = loading || isSubmitting;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>
            Entrez vos identifiants pour accéder à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive text-destructive">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                disabled={isButtonDisabled}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Mot de passe
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isButtonDisabled}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isButtonDisabled}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(checked === true)} 
                disabled={isButtonDisabled}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Se souvenir de moi
              </label>
            </div>
            
            <Button type="submit" className="w-full" disabled={isButtonDisabled}>
              {isButtonDisabled ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Se connecter
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-4 flex items-center justify-center">
            <span className="text-xs text-muted-foreground px-2">Ou</span>
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleDemoLogin}
            className="w-full mt-4"
            disabled={isButtonDisabled}
          >
            {isButtonDisabled ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              "Démo (connexion rapide)"
            )}
          </Button>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte? Contactez votre administrateur
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
