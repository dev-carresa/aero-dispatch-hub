
import { useRolesData } from './useRolesData';
import { useRolePermissions } from './useRolePermissions';
import { useRoleManagement } from './useRoleManagement';
import { useUserRoles } from './useUserRoles';

/**
 * Main hook that combines all role management functionality
 */
export function useRolesManager() {
  const { roles, setRoles, users, setUsers, isLoading } = useRolesData();
  
  const { 
    isSaving: isSavingPermissions,
    handleRolePermissionChange,
    handleCategoryPermissionChange,
    saveRolePermissions
  } = useRolePermissions(roles, setRoles);

  const {
    isSaving: isSavingRoles,
    handleDeleteRole,
    handleCreateRole,
    handleCopyRole
  } = useRoleManagement(roles, setRoles, users);

  const {
    isSaving: isSavingUserRoles,
    handleUserRoleChange,
    saveUserPermissions
  } = useUserRoles(users, setUsers, roles);

  const isSaving = isSavingPermissions || isSavingRoles || isSavingUserRoles;

  return {
    roles,
    users,
    isLoading,
    isSaving,
    handleRolePermissionChange,
    handleCategoryPermissionChange,
    handleUserRoleChange,
    handleDeleteRole,
    handleCreateRole,
    handleCopyRole,
    saveRolePermissions,
    saveUserPermissions
  };
}
