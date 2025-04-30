
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { usePermission } from "@/context/PermissionContext";
import { Spinner } from "../ui/spinner";
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
  const { user, loading: authLoading } = useAuth();
  const { hasPermission, hasAnyPermission, loading: permissionLoading } = usePermission();
  const location = useLocation();

  // Show spinner while loading auth or permissions
  if (authLoading || permissionLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!user) {
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
    return <Navigate to="/unauthorized" replace />;
  }

  // Check for any of multiple permissions
  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
