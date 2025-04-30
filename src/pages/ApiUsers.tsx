
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiUsersHeader } from "@/components/api-users/ApiUsersHeader";
import { ApiUsersFilters } from "@/components/api-users/ApiUsersFilters";
import { ApiUsersTable } from "@/components/api-users/ApiUsersTable";
import { ApiUserStatusDialog } from "@/components/api-users/ApiUserStatusDialog";
import { ApiUserDeleteDialog } from "@/components/api-users/ApiUserDeleteDialog";
import { ApiUser } from "@/types/apiUser";
import { sampleApiUsers } from "@/data/sampleApiUsers";
import { toast } from "sonner";

export default function ApiUsers() {
  const navigate = useNavigate();
  
  const [apiUsers, setApiUsers] = useState<ApiUser[]>(sampleApiUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  
  const [userToChangeStatus, setUserToChangeStatus] = useState<ApiUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<ApiUser | null>(null);
  
  // Search and filter functions
  const filteredApiUsers = apiUsers.filter((user) => {
    // Search by name, email, or company
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status
    const matchesStatus =
      statusFilter === "all" ||
      user.status === statusFilter;
    
    // Filter by service type
    const matchesServiceType =
      serviceTypeFilter === "all" ||
      user.serviceType === serviceTypeFilter;
    
    return matchesSearch && matchesStatus && matchesServiceType;
  });
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };
  
  // Handle service type filter change
  const handleServiceTypeFilterChange = (value: string) => {
    setServiceTypeFilter(value);
  };
  
  // Action handlers for table
  const handleViewApiUser = (user: ApiUser) => {
    navigate(`/api-users/${user.id}`);
  };
  
  const handleEditApiUser = (user: ApiUser) => {
    navigate(`/api-users/${user.id}/edit`);
  };
  
  const handleDeleteApiUser = (user: ApiUser) => {
    setUserToDelete(user);
  };
  
  const confirmDeleteApiUser = () => {
    if (!userToDelete) return;
    
    // Remove the user from the list
    setApiUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id));
    
    // Show success toast
    toast.success(`${userToDelete.name} has been deleted`);
    
    // Close dialog
    setUserToDelete(null);
  };
  
  const handleToggleStatus = (user: ApiUser) => {
    setUserToChangeStatus(user);
  };
  
  const confirmToggleStatus = () => {
    if (!userToChangeStatus) return;
    
    // Update the user's status
    setApiUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userToChangeStatus.id
          ? { ...user, status: user.status === "active" ? "inactive" : "active" }
          : user
      )
    );
    
    // Show success toast
    const newStatus = userToChangeStatus.status === "active" ? "deactivated" : "activated";
    toast.success(`${userToChangeStatus.name} has been ${newStatus}`);
    
    // Close dialog
    setUserToChangeStatus(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <ApiUsersHeader apiUserCount={apiUsers.length} />
      
      <ApiUsersFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        serviceTypeFilter={serviceTypeFilter}
        handleSearchChange={handleSearchChange}
        handleStatusFilterChange={handleStatusFilterChange}
        handleServiceTypeFilterChange={handleServiceTypeFilterChange}
      />
      
      <ApiUsersTable
        apiUsers={filteredApiUsers}
        onView={handleViewApiUser}
        onEdit={handleEditApiUser}
        onDelete={handleDeleteApiUser}
        onToggleStatus={handleToggleStatus}
      />
      
      <ApiUserStatusDialog
        apiUser={userToChangeStatus}
        isOpen={!!userToChangeStatus}
        onClose={() => setUserToChangeStatus(null)}
        onConfirm={confirmToggleStatus}
      />
      
      <ApiUserDeleteDialog
        apiUser={userToDelete}
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDeleteApiUser}
      />
    </div>
  );
}
