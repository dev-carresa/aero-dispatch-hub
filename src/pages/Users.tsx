
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { User, UserRole, UserStatus, DriverAvailability } from "@/types/user";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UserFilters } from "@/components/users/UserFilters";
import { UsersTable } from "@/components/users/UsersTable";
import { UserStatusDialog } from "@/components/users/UserStatusDialog";
import { supabase } from "@/integrations/supabase/client"; 

const Users = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const roleParam = searchParams.get("role") || "all";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(roleParam);
  const [statusFilter, setStatusFilter] = useState("all");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("all");
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');

        if (error) {
          throw error;
        }

        // Map Supabase data to User type
        if (data) {
          const mappedUsers: User[] = data.map(profile => ({
            id: profile.id,
            name: profile.name || (profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : 'No Name'),
            firstName: profile.first_name,
            lastName: profile.last_name,
            email: profile.email,
            role: profile.role as UserRole,
            status: profile.status as UserStatus, // Cast string to UserStatus
            lastActive: profile.last_active || 'Never',
            imageUrl: profile.image_url || '',
            phone: profile.phone,
            nationality: profile.nationality,
            dateOfBirth: profile.date_of_birth,
            fleetId: profile.fleet_id ? Number(profile.fleet_id) : undefined, // Convert string to number or use undefined
            countryCode: profile.country_code,
            vehicleType: profile.vehicle_type,
            driverAvailability: profile.driver_availability as DriverAvailability || 'offline'
          }));
          setUsers(mappedUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
    // Explicitly convert user.id to string to fix type error
    navigate(`/users/${typeof user.id === 'number' ? user.id.toString() : user.id}`);
  };

  const handleEditUser = (user: User) => {
    // Explicitly convert user.id to string to fix type error
    navigate(`/users/${typeof user.id === 'number' ? user.id.toString() : user.id}`);
  };

  // Toggle user status
  const toggleUserStatus = async (user: User, newStatus?: string) => {
    if (user.role === "Driver" && newStatus) {
      try {
        // Update driver availability in Supabase
        const { error } = await supabase
          .from('profiles')
          .update({ driver_availability: newStatus })
          .eq('id', user.id);
          
        if (error) throw error;
        
        // Update local state
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u.id === user.id
              ? { ...u, driverAvailability: newStatus as DriverAvailability }
              : u
          )
        );
        toast.success(`Driver ${user.name}'s availability updated to ${newStatus.replace('_', ' ')}`);
      } catch (error) {
        console.error('Error updating driver status:', error);
        toast.error('Failed to update driver status');
      }
    } else {
      try {
        // Toggle active/inactive status for non-drivers
        const newUserStatus = user.status === "active" ? "inactive" : "active";
        
        const { error } = await supabase
          .from('profiles')
          .update({ status: newUserStatus })
          .eq('id', user.id);
          
        if (error) throw error;
        
        // Update local state
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u.id === user.id
              ? { ...u, status: newUserStatus as UserStatus }
              : u
          )
        );
        
        const actionText = user.status === "active" ? "deactivated" : "activated";
        toast.success(`User ${user.name} ${actionText} successfully`);
      } catch (error) {
        console.error('Error updating user status:', error);
        toast.error('Failed to update user status');
      }
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
