
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // For homepage requests, redirect to welcome page
    if (location.pathname === '/') {
      return <Navigate to="/welcome" replace />;
    }
    
    // For all other protected routes, redirect to login with return URL
    return (
      <Navigate
        to="/auth"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
};
