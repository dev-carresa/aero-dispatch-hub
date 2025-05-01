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
  redirectPath = "/unauthorized" 
}: RoleProtectedRouteProps) => {
  const { user } = useAuth();
  const { hasPermission, hasAnyPermission, isAdmin } = usePermission();
  const location = useLocation();

  console.log("RoleProtectedRoute - Current path:", location.pathname);
  console.log("RoleProtectedRoute - User state:", user ? "Logged in" : "Not logged in");

  // Public paths should never go through RoleProtectedRoute
  // This check should never be triggered as public routes are defined outside RoleProtectedRoute in App.tsx
  // But keeping it as a safety check
  const publicPaths = ["/welcome", "/auth", "/auth/update-password", "/unauthorized"];
  if (publicPaths.some(path => location.pathname === path || location.pathname.startsWith(`${path}/`))) {
    console.log("RoleProtectedRoute - This is a public path that shouldn't be role-protected");
    return children ? <>{children}</> : <Outlet />;
  }

  // If no user is logged in, redirect to login
  if (!user) {
    console.log("RoleProtectedRoute - User not logged in, redirecting to:", "/auth");
    return (
      <Navigate
        to="/auth"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Admin bypass - Admins can access everything
  if (isAdmin) {
    console.log("RoleProtectedRoute - User is admin, granting access");
    return children ? <>{children}</> : <Outlet />;
  }

  // Check for single permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    console.log("RoleProtectedRoute - Missing permission:", requiredPermission);
    return <Navigate to={redirectPath} replace />;
  }

  // Check for any of multiple permissions
  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    console.log("RoleProtectedRoute - Missing permissions:", requiredPermissions);
    return <Navigate to={redirectPath} replace />;
  }

  console.log("RoleProtectedRoute - Access granted");
  return children ? <>{children}</> : <Outlet />;
};
