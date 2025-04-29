
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Vehicle } from "@/types/vehicle";
import { initialVehicles } from "@/data/sampleVehicles";
import { VehiclesHeader } from "@/components/vehicles/VehiclesHeader";
import { VehicleFilters } from "@/components/vehicles/VehicleFilters";
import { VehiclesTable } from "@/components/vehicles/VehiclesTable";
import { DeleteVehicleDialog } from "@/components/vehicles/DeleteVehicleDialog";
import { ChangeVehicleStatusDialog } from "@/components/vehicles/ChangeVehicleStatusDialog";

const Vehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [fleetFilter, setFleetFilter] = useState("all");
  const [driverFilter, setDriverFilter] = useState("all");
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [vehicleToUpdateStatus, setVehicleToUpdateStatus] = useState<Vehicle | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  // Filter vehicles based on search term and filters
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      searchTerm === "" ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.registrationNumber && vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    const matchesType = typeFilter === "all" || vehicle.type === typeFilter;
    
    // Fleet and driver filters would need actual fleet/driver data in a real app
    const matchesFleet = fleetFilter === "all" || (vehicle.fleetId && vehicle.fleetId.toString() === fleetFilter);
    const matchesDriver = driverFilter === "all" || (vehicle.assignedDriverId && vehicle.assignedDriverId.toString() === driverFilter);

    return matchesSearch && matchesStatus && matchesType && matchesFleet && matchesDriver;
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

  // Handle fleet filter change
  const handleFleetFilterChange = (value: string) => {
    setFleetFilter(value);
  };

  // Handle driver filter change
  const handleDriverFilterChange = (value: string) => {
    setDriverFilter(value);
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

  // Handle edit vehicle
  const handleEditVehicle = (vehicle: Vehicle) => {
    navigate(`/vehicles/${vehicle.id}/edit`);
  };

  // Handle status change click
  const handleStatusClick = (vehicle: Vehicle) => {
    setVehicleToUpdateStatus(vehicle);
    setShowStatusDialog(true);
  };

  // Handle status change
  const handleStatusChange = (vehicle: Vehicle, newStatus: Vehicle["status"]) => {
    setVehicles(
      vehicles.map((v) =>
        v.id === vehicle.id ? { ...v, status: newStatus, updatedAt: new Date().toISOString() } : v
      )
    );
    toast.success(`Vehicle ${vehicle.make} ${vehicle.model} status updated to ${newStatus}`);
    setShowStatusDialog(false);
    setVehicleToUpdateStatus(null);
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
        fleetFilter={fleetFilter}
        driverFilter={driverFilter}
        handleSearchChange={handleSearchChange}
        handleStatusFilterChange={handleStatusFilterChange}
        handleTypeFilterChange={handleTypeFilterChange}
        handleFleetFilterChange={handleFleetFilterChange}
        handleDriverFilterChange={handleDriverFilterChange}
      />

      <VehiclesTable
        vehicles={filteredVehicles}
        onDeleteVehicle={handleDeleteVehicle}
        onEditVehicle={handleEditVehicle}
        onStatusClick={handleStatusClick}
      />

      <DeleteVehicleDialog
        vehicle={vehicleToDelete}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={handleConfirmDelete}
      />

      <ChangeVehicleStatusDialog
        vehicle={vehicleToUpdateStatus}
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default Vehicles;
