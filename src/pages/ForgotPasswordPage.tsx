
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Veuillez saisir votre adresse email.");
      return;
    }

    setLoading(true);
    try {
      // Call Supabase password reset
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setSubmitted(true);
      toast.success("Un email de réinitialisation a été envoyé à votre adresse.");
    } catch (error) {
      console.error("Error sending password reset:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Mot de passe oublié</CardTitle>
            <CardDescription>
              {submitted 
                ? "Vérifiez votre boîte de réception pour les instructions" 
                : "Saisissez votre email pour recevoir un lien de réinitialisation"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                <AlertDescription>
                  Un email de réinitialisation a été envoyé à {email}. Veuillez vérifier votre boîte de réception et suivre les instructions pour réinitialiser votre mot de passe.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !email}
                >
                  {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="link" asChild>
              <Link to="/" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
