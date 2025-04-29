
import React from "react";
import { useFormContext } from "react-hook-form";
import { VehicleFormData } from "@/lib/schemas/vehicleSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { FileInput } from "@/components/ui/file-input";

export function VehicleImageUpload() {
  const { control } = useFormContext<VehicleFormData>();

  return (
    <FormField
      control={control}
      name="imageUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Vehicle Image</FormLabel>
          <FormControl>
            <FileInput 
              label="Upload vehicle image"
              previewUrl={field.value}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  // In a real app, this would be an API upload call
                  // For now, we'll just create a placeholder URL
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (event.target?.result) {
                      field.onChange(event.target.result as string);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
              accept="image/*"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
