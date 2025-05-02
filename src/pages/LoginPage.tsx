// Imports
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { LoginForm } from "@/components/login/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { clearStoredSession } from "@/services/sessionStorageService";

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Clear session storage on login page
    clearStoredSession();
  }, []);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <AuthRedirect />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <LoginForm />
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
