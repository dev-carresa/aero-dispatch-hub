
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
  onStatusChange: (vehicle: Vehicle, newStatus: Vehicle["status"]) => void;
}

export function VehiclesTable({ vehicles, onDeleteVehicle, onStatusChange }: VehiclesTableProps) {
  const navigate = useNavigate();
  
  const getStatusBadge = (status: Vehicle["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">Active</Badge>;
      case "maintenance":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200">Maintenance</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200">Inactive</Badge>;
      case "retired":
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">Retired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
            <TableHead className="hidden lg:table-cell">Mileage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No vehicles found.
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
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
                  <div className="text-sm text-muted-foreground">{vehicle.year}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{vehicle.licensePlate}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="capitalize">{vehicle.type}</span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {vehicle.mileage.toLocaleString()} mi
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        {getStatusBadge(vehicle.status)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => onStatusChange(vehicle, "active")}>
                        Set as Active
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(vehicle, "maintenance")}>
                        Set to Maintenance
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(vehicle, "inactive")}>
                        Set as Inactive
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(vehicle, "retired")}>
                        Set as Retired
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
                        <Settings className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDeleteVehicle(vehicle)}
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
