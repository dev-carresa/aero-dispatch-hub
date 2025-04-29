
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Vehicle } from "@/types/vehicle";
import { vehicleSchema, type VehicleFormData } from "@/lib/schemas/vehicleSchema";
import { Form } from "@/components/ui/form";

// Import form section components
import { BasicVehicleInfo } from "./form/BasicVehicleInfo";
import { VehicleStatusSection } from "./form/VehicleStatusSection";
import { VehicleAssignmentSection } from "./form/VehicleAssignmentSection";
import { VehicleDateFields } from "./form/VehicleDateFields";
import { VehicleImageUpload } from "./form/VehicleImageUpload";
import { VehicleFormActions } from "./form/VehicleFormActions";

interface VehicleFormProps {
  vehicle?: Vehicle;
  isEditMode?: boolean;
}

export function VehicleForm({ vehicle, isEditMode = false }: VehicleFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form setup with validation
  const formMethods = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: isEditMode && vehicle ? {
      type: vehicle.type,
      model: vehicle.model,
      registrationNumber: vehicle.registrationNumber || "",
      licensePlate: vehicle.licensePlate,
      make: vehicle.make,
      year: vehicle.year,
      capacity: vehicle.capacity,
      status: vehicle.status,
      color: vehicle.color,
      fleetId: vehicle.fleetId?.toString() || "",
      assignedDriverId: vehicle.assignedDriverId?.toString() || "",
      insuranceExpiry: vehicle.insuranceExpiry ? new Date(vehicle.insuranceExpiry) : undefined,
      technicalControlExpiry: vehicle.technicalControlExpiry ? new Date(vehicle.technicalControlExpiry) : undefined,
    } : {
      type: "",
      model: "",
      registrationNumber: "",
      licensePlate: "",
      make: "",
      year: new Date().getFullYear(),
      capacity: 5,
      status: "active",
      color: "",
      fleetId: "",
      assignedDriverId: "",
    }
  });

  const handleSubmit = async (data: VehicleFormData) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      console.log("Form data submitted:", data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditMode) {
        toast.success(`Vehicle ${data.make} ${data.model} updated successfully`);
      } else {
        toast.success(`Vehicle ${data.make} ${data.model} created successfully`);
      }
      
      navigate("/vehicles");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was a problem saving the vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Form {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Vehicle Information Section */}
          <BasicVehicleInfo />

          <div className="grid gap-6 md:grid-cols-2">
            {/* Status Section */}
            <VehicleStatusSection />
          </div>

          {/* Assignment Section */}
          <VehicleAssignmentSection />

          {/* Date Fields Section */}
          <VehicleDateFields />

          {/* Vehicle Image Upload */}
          <VehicleImageUpload />

          {/* Form Actions */}
          <VehicleFormActions isSubmitting={isSubmitting} isEditMode={isEditMode} />
        </form>
      </Form>
    </FormProvider>
  );
}
