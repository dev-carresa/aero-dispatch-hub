
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

  // Demo credentials for an admin account
  const demoEmail = "admin@example.com";
  const demoPassword = "admin123456";

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
    
    try {
      console.log("Attempting login with:", values.email);
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        // Check if using demo credentials
        if (values.email === demoEmail && values.password === demoPassword) {
          setAuthError("Demo admin account not found. Please create this user in your Supabase project with Admin role and all permissions.");
        } else {
          setAuthError(error.message);
        }
        onAuthError(error.message);
        setIsSubmitting(false);
        return;
      }
      
      // If we get here, login was successful
      console.log("Login successful, preparing to navigate");
      // Navigation will be handled by AuthPage's useEffect
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      console.error("Login error:", errorMessage);
      setAuthError(errorMessage);
      onAuthError(errorMessage);
      setIsSubmitting(false);
    }
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

      {/* Demo credentials section with improved explanation */}
      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-900">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-sm">Demo Admin Credentials</h3>
            <p className="text-xs text-muted-foreground mt-1">
              <strong>Important:</strong> Create this admin user in your Supabase dashboard first:
            </p>
            <div className="mt-2 text-xs">
              <p><strong>Email:</strong> {demoEmail}</p>
              <p><strong>Password:</strong> {demoPassword}</p>
              <p><strong>Role:</strong> Admin (with all permissions)</p>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fillDemoCredentials} 
                className="text-xs h-7 w-full"
              >
                Fill Demo Admin Credentials
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
