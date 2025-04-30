
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileInput } from "@/components/ui/file-input";
import { MapSelector } from "./MapSelector";
import { useEffect, useState } from "react";
import { Airport, MeetingPoint } from "@/types/airport";
import { sampleAirports } from "@/data/sampleAirports";
import { User, UserRole } from "@/types/user";

// Sample user data for role-based checks
const CURRENT_USER: User = {
  id: 1,
  name: "Admin User",
  email: "admin@example.com",
  role: "Admin" as UserRole,
  status: "active",
  lastActive: "2023-04-30T10:30:00Z",
  imageUrl: "",
};

// Sample fleets data for dropdown
const FLEETS = [
  { id: 1, name: "Executive Fleet" },
  { id: 2, name: "Standard Fleet" },
  { id: 3, name: "Premium Fleet" },
];

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
  const isAdmin = CURRENT_USER.role === "Admin";
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
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

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview !== meetingPoint?.imageUrl) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, meetingPoint]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="airportId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Airport</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isEditing}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an airport" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sampleAirports.map((airport: Airport) => (
                    <SelectItem key={airport.id} value={airport.id.toString()}>
                      {airport.name} ({airport.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terminal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Terminal</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Terminal 5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Cover Image</FormLabel>
          <FileInput
            label="Upload Image"
            showPreview={true}
            accept=".jpg,.jpeg,.png"
            onChange={handleImageChange}
            previewUrl={imagePreview}
          />
          <FormDescription>
            Upload an image of the meeting point to help drivers and passengers identify it.
          </FormDescription>
        </div>

        <FormField
          control={form.control}
          name="pickupInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pickup Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed instructions for the pickup location..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide clear instructions for drivers and passengers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isAdmin && (
          <FormField
            control={form.control}
            name="fleetId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned Fleet</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a fleet" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No Fleet Assigned</SelectItem>
                    {FLEETS.map((fleet) => (
                      <SelectItem key={fleet.id} value={fleet.id.toString()}>
                        {fleet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Only administrators can assign fleets to meeting points.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <MapSelector
          initialLatitude={form.getValues("latitude")}
          initialLongitude={form.getValues("longitude")}
          onLocationChange={handleLocationChange}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update" : "Create"} Meeting Point
          </Button>
        </div>
      </form>
    </Form>
  );
}
