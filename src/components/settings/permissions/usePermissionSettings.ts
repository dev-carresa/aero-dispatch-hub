
import { useState, useEffect } from "react";
import { SimpleRole, SimpleUser } from "./types";
import { fetchRolesAndPermissions } from "./services/roleService";
import { fetchUsers } from "./services/userService";

export function usePermissionSettings() {
  const [roles, setRoles] = useState<SimpleRole[]>([]);
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbMode, setDbMode] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Load roles and permissions using service functions
  useEffect(() => {
    const loadRolesAndPermissions = async () => {
      try {
        setIsLoading(true);
        
        // Fetch roles and permissions
        const { roles: fetchedRoles, dbMode: fetchedDbMode, dbError: fetchedDbError } = 
          await fetchRolesAndPermissions();
        
        setRoles(fetchedRoles);
        setDbMode(fetchedDbMode);
        setDbError(fetchedDbError);
        
        // Fetch users if in database mode
        if (fetchedDbMode) {
          const fetchedUsers = await fetchUsers();
          setUsers(fetchedUsers);
        }
      } catch (error) {
        console.error("Error in usePermissionSettings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRolesAndPermissions();
  }, []);

  return {
    roles,
    setRoles,
    users,
    setUsers,
    isLoading,
    dbMode,
    dbError,
  };
}
