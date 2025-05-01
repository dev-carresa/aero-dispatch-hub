
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/auth/LoginForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  
  console.log("AuthPage - Rendering, user state:", user ? "logged in" : "not logged in");
  console.log("AuthPage - Current location:", location.pathname);
  console.log("AuthPage - Location state:", location.state);
  
  // Handle auth errors from child components
  const handleAuthError = (error: string) => {
    setAuthError(error);
  };

  // Redirect if user is already logged in - moved to useEffect to avoid React warnings
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting...");
      const from = location.state?.from || "/";
      console.log("Redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, location.state]);

  // Don't render anything if user is logged in and we're about to redirect
  if (user) {
    console.log("AuthPage - User is logged in, returning null");
    return null;
  }

  console.log("AuthPage - Rendering auth form, showResetPassword:", showResetPassword);
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader showResetPassword={showResetPassword} />

        {!showResetPassword ? (
          <Card>
            <CardContent className="pt-6">
              <LoginForm 
                onShowResetPassword={() => setShowResetPassword(true)} 
                onAuthError={handleAuthError}
              />
            </CardContent>
            <CardFooter>
              <div className="text-center w-full">
                <Button 
                  variant="link" 
                  onClick={() => setShowResetPassword(true)}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Forgot your password?
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                Enter your email and we'll send you a link to reset your password
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ResetPasswordForm 
                onBackToLogin={() => setShowResetPassword(false)} 
                onAuthError={handleAuthError}
              />
            </CardContent>
          </Card>
        )}

        <AuthFooter />
      </div>
    </div>
  );
}
