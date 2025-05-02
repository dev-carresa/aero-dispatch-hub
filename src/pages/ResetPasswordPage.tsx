
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if we have the necessary parameters from the email link
    const resetToken = searchParams.get("token_hash");
    
    if (!resetToken) {
      toast.error("Lien de réinitialisation invalide ou expiré");
      navigate("/");
    }
  }, [searchParams, navigate]);

  const validatePassword = () => {
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    try {
      // Update password using the hash from the URL
      const { error } = await supabase.auth.updateUser({ 
        password 
      });

      if (error) {
        throw error;
      }

      toast.success("Mot de passe mis à jour avec succès");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Une erreur est survenue lors de la réinitialisation du mot de passe");
      setError("La réinitialisation du mot de passe a échoué. Veuillez réessayer ou demander un nouveau lien.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Réinitialisation du mot de passe</CardTitle>
            <CardDescription>
              Veuillez définir votre nouveau mot de passe
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
                <Info className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                    placeholder="••••••••"
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
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pr-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !password || !confirmPassword}
              >
                {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col text-sm text-muted-foreground">
            <p>Le mot de passe doit contenir au moins 8 caractères.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
