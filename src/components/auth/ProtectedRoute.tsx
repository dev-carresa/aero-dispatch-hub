
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute - Current path:", location.pathname);
  console.log("ProtectedRoute - User state:", user ? "Logged in" : "Not logged in");

  // These paths should always be accessible without authentication
  const publicPaths = ["/welcome", "/auth", "/auth/update-password", "/unauthorized"];
  
  if (publicPaths.includes(location.pathname)) {
    console.log("ProtectedRoute - This is a public path, no auth required");
    return children ? <>{children}</> : <Outlet />;
  }

  if (!user) {
    // For homepage requests, redirect to welcome page
    if (location.pathname === '/') {
      console.log("ProtectedRoute - Redirecting to welcome page");
      return <Navigate to="/welcome" replace />;
    }
    
    // For all other protected routes, redirect to login with return URL
    console.log("ProtectedRoute - Redirecting to auth page");
    return (
      <Navigate
        to="/auth"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  console.log("ProtectedRoute - User is authenticated, allowing access");
  return children ? <>{children}</> : <Outlet />;
};
