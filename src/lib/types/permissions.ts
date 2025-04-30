
import { Permission } from '@/lib/permissions';

export interface DbRole {
  id: string;
  name: string;
  description: string | null;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbPermission {
  id: string;
  name: Permission;
  description: string | null;
  created_at: string;
}

export interface DbRolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: string;
}

export interface RoleWithPermissions extends DbRole {
  permissions: Permission[];
}
