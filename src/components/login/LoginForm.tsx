
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, LogIn, Loader2, Shield } from "lucide-react";
import { getRememberedEmail } from "@/services/sessionStorageService";

interface LoginFormProps {
  onSubmit: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  isButtonDisabled: boolean;
  loginError: string;
  variant?: "admin" | "standard";
}

export const LoginForm = ({ 
  onSubmit, 
  isButtonDisabled, 
  loginError,
  variant = "standard" 
}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const isAdmin = variant === "admin";
  
  // Load remembered email on mount
  useEffect(() => {
    if (!isAdmin) {
      const savedEmail = getRememberedEmail();
      if (savedEmail) {
        setEmail(savedEmail);
      }
    }
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await onSubmit(email, password, rememberMe);
  };

  // Set button colors based on variant
  const buttonClasses = isAdmin
    ? "w-full bg-purple-600 hover:bg-purple-700"
    : "w-full";

  // Set input classes based on variant
  const inputClasses = isAdmin
    ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
    : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {loginError && (
        <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive text-destructive">
          {loginError}
        </div>
      )}
      
      <div className="space-y-2">
        <label 
          htmlFor="email" 
          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
            isAdmin ? "text-gray-200" : ""
          }`}
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          disabled={isButtonDisabled}
          required
          className={inputClasses}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label 
            htmlFor="password" 
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
              isAdmin ? "text-gray-200" : ""
            }`}
          >
            Mot de passe
          </label>
          <Link 
            to="/forgot-password" 
            className={`text-sm font-medium hover:underline ${
              isAdmin ? "text-purple-400 hover:text-purple-300" : "text-primary"
            }`}
          >
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
            disabled={isButtonDisabled}
            required
            className={inputClasses}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`absolute right-0 top-0 h-full ${
              isAdmin ? "text-gray-300 hover:text-white" : ""
            }`}
            onClick={() => setShowPassword(!showPassword)}
            disabled={isButtonDisabled}
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
          disabled={isButtonDisabled}
          className={isAdmin ? "border-gray-500 data-[state=checked]:bg-purple-600" : ""}
        />
        <label
          htmlFor="remember"
          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
            isAdmin ? "text-gray-300" : ""
          }`}
        >
          Se souvenir de moi
        </label>
      </div>
      
      <Button type="submit" className={buttonClasses} disabled={isButtonDisabled}>
        {isButtonDisabled ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connexion en cours...
          </>
        ) : (
          <>
            {isAdmin ? (
              <Shield className="mr-2 h-4 w-4" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            Se connecter
          </>
        )}
      </Button>
    </form>
  );
};
