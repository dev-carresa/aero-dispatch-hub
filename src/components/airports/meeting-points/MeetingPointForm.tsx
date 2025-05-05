
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { Airport, MeetingPoint } from "@/types/airport";
import { User, UserRole } from "@/types/user";
import { MapSelector } from "./MapSelector";

// Component imports
import { AirportSelector } from "./form/AirportSelector";
import { MeetingPointBasicInfo } from "./form/MeetingPointBasicInfo";
import { FleetSelector } from "./form/FleetSelector";
import { HiddenCoordinates } from "./form/HiddenCoordinates";
import { ImageUpload } from "./form/ImageUpload";
import { FormActions } from "./form/FormActions";

// Sample user data for role-based checks
const CURRENT_USER: User = {
  id: "1",
  name: "Admin User",
  email: "admin@example.com",
  role: "Admin" as UserRole,
  status: "active",
  lastActive: "2023-04-30T10:30:00Z",
  imageUrl: "",
};

const meetingPointSchema = z.object({
  terminal: z.string().min(1, "Terminal is required"),
  pickupInstructions: z.string().min(10, "Pickup instructions must be at least 10 characters"),
  airportId: z.string().min(1, "Airport is required"),
  fleetId: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
});

type FormData = z.infer<typeof meetingPointSchema>;

interface MeetingPointFormProps {
  meetingPoint?: MeetingPoint;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  airportId?: string;
}

export function MeetingPointForm({ 
  meetingPoint, 
  onSubmit, 
  isLoading = false,
  airportId: initialAirportId
}: MeetingPointFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(meetingPoint?.imageUrl || "");
  const isEditing = !!meetingPoint;

  const form = useForm<FormData>({
    resolver: zodResolver(meetingPointSchema),
    defaultValues: {
      terminal: meetingPoint?.terminal || "",
      pickupInstructions: meetingPoint?.pickupInstructions || "",
      airportId: meetingPoint?.airportId.toString() || initialAirportId || "",
      fleetId: meetingPoint?.fleetId?.toString() || "",
      latitude: meetingPoint?.latitude || 51.5074,
      longitude: meetingPoint?.longitude || -0.1278,
    },
  });

  const handleLocationChange = (lat: number, lng: number) => {
    form.setValue("latitude", lat);
    form.setValue("longitude", lng);
  };

  const handleImageChange = (file: File | null, preview: string) => {
    setImageFile(file);
    setImagePreview(preview);
  };

  const handleSubmit = (data: FormData) => {
    // Combine form data with image
    const formData = {
      ...data,
      imageUrl: imagePreview || meetingPoint?.imageUrl || "",
      // Convert to appropriate types
      airportId: parseInt(data.airportId),
      fleetId: data.fleetId ? parseInt(data.fleetId) : undefined,
    };
    
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <AirportSelector form={form} isEditing={isEditing} />
        <MeetingPointBasicInfo form={form} />
        <ImageUpload 
          initialImageUrl={meetingPoint?.imageUrl} 
          onImageChange={handleImageChange} 
        />
        <FleetSelector form={form} currentUser={CURRENT_USER} />
        <HiddenCoordinates form={form} />
        
        <MapSelector
          initialLatitude={form.getValues("latitude")}
          initialLongitude={form.getValues("longitude")}
          onLocationChange={handleLocationChange}
        />

        <FormActions isEditing={isEditing} isLoading={isLoading} />
      </form>
    </Form>
  );
}
