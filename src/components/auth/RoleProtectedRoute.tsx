
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { usePermission } from "@/context/PermissionContext";
import { Permission } from "@/lib/permissions";

interface RoleProtectedRouteProps {
  children?: React.ReactNode;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  redirectPath?: string;
}

export const RoleProtectedRoute = ({ 
  children, 
  requiredPermission,
  requiredPermissions,
  redirectPath = "/auth" 
}: RoleProtectedRouteProps) => {
  const { user } = useAuth();
  const { hasPermission, hasAnyPermission } = usePermission();
  const location = useLocation();

  console.log("RoleProtectedRoute - Current path:", location.pathname);
  console.log("RoleProtectedRoute - User state:", user ? "Logged in" : "Not logged in");

  // If no user is logged in, redirect to login
  if (!user) {
    console.log("RoleProtectedRoute - User not logged in, redirecting to:", redirectPath);
    return (
      <Navigate
        to={redirectPath}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Check for single permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    console.log("RoleProtectedRoute - Missing permission:", requiredPermission);
    return <Navigate to="/unauthorized" replace />;
  }

  // Check for any of multiple permissions
  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    console.log("RoleProtectedRoute - Missing permissions:", requiredPermissions);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("RoleProtectedRoute - Access granted");
  return children ? <>{children}</> : <Outlet />;
};
