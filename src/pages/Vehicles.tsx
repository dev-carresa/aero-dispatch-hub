
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Vehicle } from "@/types/vehicle";
import { initialVehicles } from "@/data/sampleVehicles";
import { VehiclesHeader } from "@/components/vehicles/VehiclesHeader";
import { VehicleFilters } from "@/components/vehicles/VehicleFilters";
import { VehiclesTable } from "@/components/vehicles/VehiclesTable";
import { DeleteVehicleDialog } from "@/components/vehicles/DeleteVehicleDialog";

const Vehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Filter vehicles based on search term and filters
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      searchTerm === "" ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    const matchesType = typeFilter === "all" || vehicle.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate totals for header
  const totalActive = vehicles.filter((v) => v.status === "active").length;
  const totalMaintenance = vehicles.filter((v) => v.status === "maintenance").length;
  const totalInactive = vehicles.filter((v) => v.status === "inactive" || v.status === "retired").length;

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  // Handle type filter change
  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
  };

  // Handle delete vehicle
  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setShowDeleteDialog(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (vehicleToDelete) {
      setVehicles(vehicles.filter((v) => v.id !== vehicleToDelete.id));
      toast.success(`Vehicle ${vehicleToDelete.make} ${vehicleToDelete.model} has been deleted`);
      setShowDeleteDialog(false);
      setVehicleToDelete(null);
    }
  };

  // Handle status change
  const handleStatusChange = (vehicle: Vehicle, newStatus: Vehicle["status"]) => {
    setVehicles(
      vehicles.map((v) =>
        v.id === vehicle.id ? { ...v, status: newStatus, updatedAt: new Date().toISOString() } : v
      )
    );
    toast.success(`Vehicle ${vehicle.make} ${vehicle.model} status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <VehiclesHeader 
        totalActive={totalActive}
        totalMaintenance={totalMaintenance}
        totalInactive={totalInactive}
      />

      <VehicleFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        handleSearchChange={handleSearchChange}
        handleStatusFilterChange={handleStatusFilterChange}
        handleTypeFilterChange={handleTypeFilterChange}
      />

      <VehiclesTable
        vehicles={filteredVehicles}
        onDeleteVehicle={handleDeleteVehicle}
        onStatusChange={handleStatusChange}
      />

      <DeleteVehicleDialog
        vehicle={vehicleToDelete}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default Vehicles;
