
import React from "react";

interface RoleFilterButtonsProps {
  roleFilter: string;
  handleRoleFilterChange: (value: string) => void;
}

export const RoleFilterButtons: React.FC<RoleFilterButtonsProps> = ({ 
  roleFilter, 
  handleRoleFilterChange 
}) => {
  return (
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
  );
};
