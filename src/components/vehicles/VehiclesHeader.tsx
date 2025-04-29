
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface VehiclesHeaderProps {
  totalActive: number;
  totalMaintenance: number;
  totalInactive: number;
}

export function VehiclesHeader({ totalActive, totalMaintenance, totalInactive }: VehiclesHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
        <p className="text-muted-foreground">
          Manage your fleet of vehicles
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex gap-2 text-sm">
          <div className="rounded-md bg-blue-50 px-2.5 py-1 text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {totalActive} Active
          </div>
          <div className="rounded-md bg-yellow-50 px-2.5 py-1 text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
            {totalMaintenance} Maintenance
          </div>
          <div className="rounded-md bg-gray-50 px-2.5 py-1 text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {totalInactive} Inactive
          </div>
        </div>
        <Button onClick={() => navigate("/vehicles/new")} className="ml-auto gap-1">
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>
    </div>
  )
}
