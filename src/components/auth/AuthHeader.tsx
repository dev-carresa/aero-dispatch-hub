
interface AuthHeaderProps {
  showResetPassword: boolean;
}

export function AuthHeader({ showResetPassword }: AuthHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold mb-2">Welcome</h1>
      <p className="text-muted-foreground">
        {showResetPassword 
          ? "Enter your email to reset your password"
          : "Sign in to your account"}
      </p>
    </div>
  );
}
