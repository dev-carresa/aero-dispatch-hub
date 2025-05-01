
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User } from "@/types/user";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UserFilters } from "@/components/users/UserFilters";
import { UsersTable } from "@/components/users/UsersTable";
import { UserStatusDialog } from "@/components/users/UserStatusDialog";
import { RoleFilterButtons } from "@/components/users/RoleFilterButtons";
import { fetchUsers } from "@/services/userService";
import { useUserFiltering } from "@/hooks/useUserFiltering";
import { useUserActions } from "@/hooks/useUserActions";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        // Error is already handled in the service
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // User filtering logic
  const {
    searchTerm,
    roleFilter,
    statusFilter,
    vehicleTypeFilter,
    filteredUsers,
    handleSearchChange,
    handleRoleFilterChange,
    handleStatusFilterChange,
    handleVehicleTypeFilterChange
  } = useUserFiltering(users);

  // User actions (view, edit, toggle status)
  const {
    userToDeactivate,
    setUserToDeactivate,
    handleViewProfile,
    handleEditUser,
    toggleUserStatus
  } = useUserActions(users, setUsers);

  return (
    <div className="space-y-6 animate-fade-in">
      <UsersHeader currentFilter={roleFilter} />
      
      <div className="flex justify-between items-center">
        <RoleFilterButtons 
          roleFilter={roleFilter}
          handleRoleFilterChange={handleRoleFilterChange}
        />
      </div>
      
      <UserFilters 
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        vehicleTypeFilter={vehicleTypeFilter}
        handleSearchChange={handleSearchChange}
        handleRoleFilterChange={handleRoleFilterChange}
        handleStatusFilterChange={handleStatusFilterChange}
        handleVehicleTypeFilterChange={handleVehicleTypeFilterChange}
      />

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <UsersTable 
          filteredUsers={filteredUsers}
          handleViewProfile={handleViewProfile}
          handleEditUser={handleEditUser}
          setUserToDeactivate={setUserToDeactivate}
          currentFilter={roleFilter}
        />
      )}

      <UserStatusDialog 
        userToDeactivate={userToDeactivate}
        setUserToDeactivate={setUserToDeactivate}
        toggleUserStatus={toggleUserStatus}
      />
    </div>
  );
};

export default Users;
