
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { VehicleForm } from "@/components/vehicles/VehicleForm";
import { initialVehicles } from "@/data/sampleVehicles";
import { Vehicle } from "@/types/vehicle";

export default function EditVehicle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchVehicle = async () => {
      try {
        // Simulating API call with sample data
        const foundVehicle = initialVehicles.find(v => v.id === Number(id));
        
        if (foundVehicle) {
          setVehicle(foundVehicle);
        } else {
          toast.error("Vehicle not found");
          navigate("/vehicles");
        }
      } catch (error) {
        console.error("Error fetching vehicle:", error);
        toast.error("Failed to load vehicle data");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading vehicle data...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Vehicle</h1>
        <p className="text-muted-foreground mt-2">
          Edit {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
        </p>
      </div>
      
      <div className="border rounded-lg p-4 md:p-6 bg-card">
        <VehicleForm vehicle={vehicle} isEditMode={true} />
      </div>
    </div>
  );
}
