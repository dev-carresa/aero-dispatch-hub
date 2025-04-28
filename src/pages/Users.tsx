
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User } from "@/types/user";
import { initialUsers } from "@/data/sampleUsers";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UserFilters } from "@/components/users/UserFilters";
import { UsersTable } from "@/components/users/UsersTable";
import { UserStatusDialog } from "@/components/users/UserStatusDialog";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);

  // Search & Filter function
  const filteredUsers = users.filter(user => {
    // Search by name or email
    const matchesSearch = 
      searchTerm === "" || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by role
    const matchesRole = 
      roleFilter === "all" || 
      user.role.toLowerCase() === roleFilter.toLowerCase();
    
    // Filter by status
    const matchesStatus = 
      statusFilter === "all" || 
      user.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle role filter change
  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  // Dropdown actions
  const handleViewProfile = (user: User) => {
    toast.info(`Viewing profile for ${user.name}`);
    // In a real application this would navigate to a user profile page
  };

  const handleEditUser = (user: User) => {
    toast.info(`Editing user ${user.name}`);
    // In a real application this would navigate to an edit user page
  };

  const toggleUserStatus = (user: User) => {
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === user.id
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    );
    
    const newStatus = user.status === "active" ? "deactivated" : "activated";
    setUserToDeactivate(null);
    toast.success(`User ${user.name} ${newStatus} successfully`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <UsersHeader />
      
      <UserFilters 
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        handleSearchChange={handleSearchChange}
        handleRoleFilterChange={handleRoleFilterChange}
        handleStatusFilterChange={handleStatusFilterChange}
      />

      <UsersTable 
        filteredUsers={filteredUsers}
        handleViewProfile={handleViewProfile}
        handleEditUser={handleEditUser}
        setUserToDeactivate={setUserToDeactivate}
      />

      <UserStatusDialog 
        userToDeactivate={userToDeactivate}
        setUserToDeactivate={setUserToDeactivate}
        toggleUserStatus={toggleUserStatus}
      />
    </div>
  );
};

export default Users;
