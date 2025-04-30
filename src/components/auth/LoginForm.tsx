
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onShowResetPassword: () => void;
  onAuthError: (error: string) => void;
}

export function LoginForm({ onShowResetPassword, onAuthError }: LoginFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  // Demo credentials for quick testing
  const demoEmail = "demo@example.com";
  const demoPassword = "demo123456";

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Fill in the demo credentials
  const fillDemoCredentials = () => {
    loginForm.setValue("email", demoEmail);
    loginForm.setValue("password", demoPassword);
  };

  // Handle login submission
  const handleLogin = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    setAuthError("");
    
    const { error } = await signIn(values.email, values.password);
    
    setIsSubmitting(false);
    
    if (error) {
      setAuthError(error.message);
      onAuthError(error.message);
      return;
    }
    
    // Redirect to the page the user was trying to access, or to the home page
    const from = location.state?.from || "/";
    navigate(from, { replace: true });
  };

  return (
    <>
      {authError && (
        <Alert variant="destructive" className="mb-4 mx-6 mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}

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
    </>
  );
}
