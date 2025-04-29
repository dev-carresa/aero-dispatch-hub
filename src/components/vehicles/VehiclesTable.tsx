
import { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VehiclesTableProps {
  vehicles: Vehicle[];
  onDeleteVehicle: (vehicle: Vehicle) => void;
  onEditVehicle: (vehicle: Vehicle) => void;
  onStatusClick: (vehicle: Vehicle) => void;
}

export function VehiclesTable({ 
  vehicles, 
  onDeleteVehicle, 
  onEditVehicle,
  onStatusClick
}: VehiclesTableProps) {
  const navigate = useNavigate();
  
  const getStatusBadge = (status: Vehicle["status"], vehicle: Vehicle) => {
    const badgeStyles = {
      active: "bg-green-50 text-green-700 hover:bg-green-100 border-green-200 cursor-pointer",
      maintenance: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200 cursor-pointer",
      inactive: "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 cursor-pointer",
      retired: "bg-red-50 text-red-700 hover:bg-red-100 border-red-200 cursor-pointer",
    };
    
    return (
      <Badge 
        variant="outline" 
        className={badgeStyles[status]}
        onClick={(e) => {
          e.stopPropagation(); // Prevent row click
          onStatusClick(vehicle);
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Format dates for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Vehicle</TableHead>
            <TableHead>Make & Model</TableHead>
            <TableHead className="hidden md:table-cell">License Plate</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="hidden lg:table-cell">Year</TableHead>
            <TableHead className="hidden xl:table-cell">Driver</TableHead>
            <TableHead className="hidden xl:table-cell">Fleet</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                No vehicles found.
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle) => (
              <TableRow 
                key={vehicle.id}
                className="cursor-pointer"
                onClick={() => navigate(`/vehicles/${vehicle.id}`)}
              >
                <TableCell>
                  {vehicle.imageUrl ? (
                    <div className="h-10 w-10 rounded-md bg-slate-100 overflow-hidden">
                      <img 
                        src={vehicle.imageUrl} 
                        alt={`${vehicle.make} ${vehicle.model}`} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-500">
                      {vehicle.make.charAt(0)}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                  <div className="text-sm text-muted-foreground">
                    {vehicle.color}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div>{vehicle.licensePlate}</div>
                  {vehicle.registrationNumber && (
                    <div className="text-xs text-muted-foreground">
                      Reg: {vehicle.registrationNumber}
                    </div>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="capitalize">{vehicle.type}</span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {vehicle.year}
                  <div className="text-xs text-muted-foreground">
                    {vehicle.capacity} seats
                  </div>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {vehicle.assignedDriverId ? "Assigned" : "Unassigned"}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {vehicle.fleetId ? "Assigned" : "Unassigned"}
                </TableCell>
                <TableCell>
                  {getStatusBadge(vehicle.status, vehicle)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/vehicles/${vehicle.id}`);
                      }}>
                        <Settings className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onEditVehicle(vehicle);
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteVehicle(vehicle);
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
