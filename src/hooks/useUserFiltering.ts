
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { useSearchParams } from "react-router-dom";

export const useUserFiltering = (users: User[]) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const roleParam = searchParams.get("role") || "all";

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(roleParam);
  const [statusFilter, setStatusFilter] = useState("all");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("all");

  // Update URL when role filter changes
  useEffect(() => {
    if (roleFilter !== "all") {
      searchParams.set("role", roleFilter);
    } else {
      searchParams.delete("role");
    }
    setSearchParams(searchParams);
  }, [roleFilter, searchParams, setSearchParams]);

  // Filter users based on search and filter criteria
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

  return {
    searchTerm,
    roleFilter,
    statusFilter,
    vehicleTypeFilter,
    filteredUsers,
    handleSearchChange,
    handleRoleFilterChange,
    handleStatusFilterChange,
    handleVehicleTypeFilterChange
  };
};
