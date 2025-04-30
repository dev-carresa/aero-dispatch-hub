
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertCircle, Info } from "lucide-react";

// Form schema for login
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Reset password schema
const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, resetPassword, user } = useAuth();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Demo credentials for quick testing
  const demoEmail = "demo@example.com";
  const demoPassword = "demo123456";

  // Fill in the demo credentials
  const fillDemoCredentials = () => {
    loginForm.setValue("email", demoEmail);
    loginForm.setValue("password", demoPassword);
  };

  // Redirect if user is already logged in
  if (user) {
    const from = location.state?.from || "/";
    navigate(from, { replace: true });
    return null;
  }

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Reset password form
  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle login submission
  const handleLogin = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    setAuthError("");
    
    const { error } = await signIn(values.email, values.password);
    
    setIsSubmitting(false);
    
    if (error) {
      setAuthError(error.message);
      return;
    }
    
    // Redirect to the page the user was trying to access, or to the home page
    const from = location.state?.from || "/";
    navigate(from, { replace: true });
  };

  // Handle reset password submission
  const handleResetPassword = async (values: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    setAuthError("");
    
    const { error } = await resetPassword(values.email);
    
    setIsSubmitting(false);
    
    if (error) {
      setAuthError(error.message);
      return;
    }
    
    // Return to login form after sending reset email
    setShowResetPassword(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome</h1>
          <p className="text-muted-foreground">
            {showResetPassword 
              ? "Enter your email to reset your password"
              : "Sign in to your account"}
          </p>
        </div>

        {!showResetPassword ? (
          <Card>
            {authError && (
              <Alert variant="destructive" className="mb-4 mx-6 mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <CardContent className="pt-6">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="example@email.com" 
                            type="email" 
                            autoComplete="email"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="••••••••" 
                            type="password"
                            autoComplete="current-password"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>

              {/* Demo credentials section */}
              <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-900">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">Demo Credentials</h3>
                    <p className="text-xs text-muted-foreground mt-1">Use these credentials to test the app:</p>
                    <div className="mt-2 text-xs">
                      <p><strong>Email:</strong> {demoEmail}</p>
                      <p><strong>Password:</strong> {demoPassword}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={fillDemoCredentials} 
                      className="mt-2 text-xs h-7 w-full"
                    >
                      Fill Demo Credentials
                    </Button>
                  </div>
                </div>
              </div>
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

            {authError && (
              <Alert variant="destructive" className="mx-6 mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <CardContent>
              <Form {...resetPasswordForm}>
                <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
                  <FormField
                    control={resetPasswordForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="example@email.com" 
                            type="email" 
                            autoComplete="email"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col space-y-2">
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </Button>
                    <Button 
                      type="button"
                      variant="ghost"
                      onClick={() => setShowResetPassword(false)}
                    >
                      Back to Login
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
