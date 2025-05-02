
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ensureDemoUserExists } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { getRememberedEmail } from "@/services/sessionStorageService";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, loading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginAttempt, setLoginAttempt] = useState(0);
  
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
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tentative de connexion:", loginAttempt + 1);
    
    setLoginAttempt(prev => prev + 1);
    
    try {
      await signIn(email, password, rememberMe);
    } catch (error) {
      console.error("Erreur de connexion:", error);
      // Si l'erreur est "Authentication already in progress", on informe l'utilisateur
      if (error instanceof Error && error.message === "Authentication already in progress") {
        toast.error("Une connexion est déjà en cours, veuillez patienter ou rafraîchir la page");
      }
      // Géré dans la fonction signIn
    }
  };
  
  const handleDemoLogin = async () => {
    try {
      // Create demo user if it doesn't exist
      await ensureDemoUserExists();
      
      // Login with demo credentials
      await signIn("admin@example.com", "password", rememberMe);
    } catch (error) {
      console.error("Erreur lors de la connexion démo:", error);
      // Si l'erreur est "Authentication already in progress", on informe l'utilisateur
      if (error instanceof Error && error.message === "Authentication already in progress") {
        toast.error("Une connexion est déjà en cours, veuillez patienter ou rafraîchir la page");
      } else {
        toast.error("Une erreur est survenue lors de la connexion avec le compte de démonstration");
      }
    }
  };

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
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
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
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Se souvenir de moi
              </label>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn className="mr-2 h-4 w-4" />
              {loading ? "Connexion en cours..." : "Se connecter"}
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
            disabled={loading}
          >
            Démo (connexion rapide)
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
