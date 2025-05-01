
import { Permission } from '@/lib/permissions';

export interface PermissionContextType {
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  isAdmin: boolean;
  roles: Record<string, Permission[]>;
  loadingPermissions: boolean;
  permissionError?: string | null;
  forceResetPermissionsLoading?: () => void;
  userPermissions?: Permission[];
}
