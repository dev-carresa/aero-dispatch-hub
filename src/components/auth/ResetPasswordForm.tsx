
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";

// Reset password schema
const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  onBackToLogin: () => void;
  onAuthError: (error: string) => void;
}

export function ResetPasswordForm({ onBackToLogin, onAuthError }: ResetPasswordFormProps) {
  const { resetPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  // Reset password form
  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle reset password submission
  const handleResetPassword = async (values: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    setAuthError("");
    
    const { error } = await resetPassword(values.email);
    
    setIsSubmitting(false);
    
    if (error) {
      setAuthError(error.message);
      onAuthError(error.message);
      return;
    }
    
    // Return to login form after sending reset email
    onBackToLogin();
  };

  return (
    <>
      {authError && (
        <Alert variant="destructive" className="mx-6 mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}

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
              onClick={onBackToLogin}
            >
              Back to Login
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
