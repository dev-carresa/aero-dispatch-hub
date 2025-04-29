
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { User, UserRole } from "@/types/user";
import { initialUsers } from "@/data/sampleUsers";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UserFilters } from "@/components/users/UserFilters";
import { UsersTable } from "@/components/users/UsersTable";
import { UserStatusDialog } from "@/components/users/UserStatusDialog";

const Users = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const roleParam = searchParams.get("role") || "all";

  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(roleParam);
  const [statusFilter, setStatusFilter] = useState("all");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("all");
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);

  // Update URL when role filter changes
  useEffect(() => {
    if (roleFilter !== "all") {
      searchParams.set("role", roleFilter);
    } else {
      searchParams.delete("role");
    }
    setSearchParams(searchParams);
  }, [roleFilter, searchParams, setSearchParams]);

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
      user.role === roleFilter;
    
    // Filter by status
    const matchesStatus = 
      statusFilter === "all" || 
      user.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Filter by vehicle type (for drivers)
    const matchesVehicleType = 
      vehicleTypeFilter === "all" || 
      (user.vehicleType && user.vehicleType.toLowerCase() === vehicleTypeFilter.toLowerCase());
    
    // Apply vehicle type filter only to drivers
    if (roleFilter === "Driver") {
      return matchesSearch && matchesRole && matchesVehicleType;
    }
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle role filter change
  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    // Reset vehicle type filter if not in Driver view
    if (value !== "Driver") {
      setVehicleTypeFilter("all");
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  // Handle vehicle type filter change
  const handleVehicleTypeFilterChange = (value: string) => {
    setVehicleTypeFilter(value);
  };

  // Dropdown actions
  const handleViewProfile = (user: User) => {
    navigate(`/users/${user.id}`);
  };

  const handleEditUser = (user: User) => {
    navigate(`/users/${user.id}`);
  };

  const toggleUserStatus = (user: User, newStatus?: string) => {
    if (user.role === "Driver" && newStatus) {
      // Update driver availability
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === user.id
            ? { ...u, driverAvailability: newStatus as any }
            : u
        )
      );
      toast.success(`Driver ${user.name}'s availability updated to ${newStatus.replace('_', ' ')}`);
    } else {
      // Toggle active/inactive status for non-drivers
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === user.id
            ? { ...u, status: u.status === "active" ? "inactive" : "active" }
            : u
        )
      );
      
      const newStatus = user.status === "active" ? "deactivated" : "activated";
      toast.success(`User ${user.name} ${newStatus} successfully`);
    }
    setUserToDeactivate(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <UsersHeader currentFilter={roleFilter} />
      
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <button 
            className={`px-3 py-1 text-sm rounded-full ${roleFilter === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            onClick={() => handleRoleFilterChange("all")}
          >
            All Users
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-full ${roleFilter === "Driver" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            onClick={() => handleRoleFilterChange("Driver")}
          >
            Drivers
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-full ${roleFilter === "Customer" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            onClick={() => handleRoleFilterChange("Customer")}
          >
            Customers
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-full ${roleFilter === "Fleet" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            onClick={() => handleRoleFilterChange("Fleet")}
          >
            Fleet
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-full ${roleFilter === "Admin" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            onClick={() => handleRoleFilterChange("Admin")}
          >
            Admins
          </button>
        </div>
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

      <UsersTable 
        filteredUsers={filteredUsers}
        handleViewProfile={handleViewProfile}
        handleEditUser={handleEditUser}
        setUserToDeactivate={setUserToDeactivate}
        currentFilter={roleFilter}
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
