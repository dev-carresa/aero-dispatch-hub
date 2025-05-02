
// Imports
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { LoginForm } from "@/components/login/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { clearStoredSession } from "@/services/sessionStorageService";

const LoginPage: React.FC = () => {
  const { isAuthenticated, signIn, loading, authError } = useAuth();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    // Clear session storage on login page
    clearStoredSession();
  }, []);

  // Handle authentication errors
  useEffect(() => {
    if (authError) {
      setLoginError(authError);
      setIsSubmitting(false);
    }
  }, [authError]);

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    setLoginError("");
    setIsSubmitting(true);
    try {
      await signIn(email, password, rememberMe);
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        setLoginError(error.message);
      }
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <AuthRedirect />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <LoginForm 
          onSubmit={handleLogin}
          isButtonDisabled={loading || isSubmitting}
          loginError={loginError}
        />
        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>
        <div className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

// AuthRedirect component
const AuthRedirect: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to dashboard after successful login
    if (user?.role === 'Admin') {
      window.location.href = '/admin/dashboard';
    } else {
      window.location.href = '/dashboard';
    }
  }, [location, user]);

  return <p>Redirecting...</p>;
};

export default LoginPage;
