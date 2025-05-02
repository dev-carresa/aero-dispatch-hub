
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const { signIn, isAuthenticated, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [setupLoading, setSetupLoading] = useState(false);

  // Show spinner while checking authentication status
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spinner size="md" className="mb-4" />
        <p className="text-muted-foreground">Checking authentication status...</p>
      </div>
    );
  }
  
  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    console.log("User is authenticated, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      console.log("Attempting login with:", email);
      await signIn(email, password);
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Provide specific error messages
      if (error?.code === "invalid_credentials") {
        setError("Invalid email or password. Make sure the demo credentials are set up correctly.");
      } else {
        setError(error?.message || "Failed to sign in. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const setupDemoUser = async () => {
    setSetupLoading(true);
    setError("");
    
    try {
      console.log("Setting up demo user...");
      // Call our edge function to set up the demo user
      const { data, error } = await supabase.functions.invoke('setup-demo-user');
      
      if (error) {
        console.error("Demo setup error:", error);
        throw error;
      }
      
      console.log("Demo user setup response:", data);
      toast.success("Demo user set up successfully! You can now log in with the demo credentials.");
      setEmail("admin@example.com");
      setPassword("password");
    } catch (error) {
      console.error("Setup error:", error);
      toast.error("Failed to set up demo user. Please contact the administrator.");
      setError("Failed to set up demo user. See console for details.");
    } finally {
      setSetupLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md px-4">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">TransportHub</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Enter your email and password to sign in</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || authLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Spinner size="sm" className="mr-2" />
                    Signing in...
                  </span>
                ) : "Sign in"}
              </Button>
              
              <div className="text-center text-sm">
                <p className="text-muted-foreground">Demo credentials:</p>
                <p className="font-medium text-primary">admin@example.com / password</p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={setupDemoUser} 
                  disabled={setupLoading}
                  className="mt-2 text-xs"
                >
                  <RefreshCw className={`h-3 w-3 mr-2 ${setupLoading ? 'animate-spin' : ''}`} />
                  {setupLoading ? "Setting up..." : "Set up demo user"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
