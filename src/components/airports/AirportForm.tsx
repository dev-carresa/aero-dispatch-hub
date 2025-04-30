
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Airport } from "@/types/airport";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormActions } from "@/components/airports/meeting-points/form/FormActions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Schema for airport form validation
const airportFormSchema = z.object({
  name: z.string().min(2, {
    message: "Airport name must be at least 2 characters.",
  }),
  code: z.string().min(3, {
    message: "Airport code must be at least 3 characters.",
  }).max(4, {
    message: "Airport code must not exceed 4 characters.",
  }),
  city: z.string().min(2, {
    message: "City name must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country name must be at least 2 characters.",
  }),
  imageUrl: z.string().optional(),
});

interface AirportFormProps {
  airport?: Airport | null;
  onSubmit: (data: z.infer<typeof airportFormSchema>) => void;
  isLoading: boolean;
}

export function AirportForm({ airport, onSubmit, isLoading }: AirportFormProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(airport?.imageUrl || "");

  // Initialize form with default values or existing airport data
  const form = useForm<z.infer<typeof airportFormSchema>>({
    resolver: zodResolver(airportFormSchema),
    defaultValues: {
      name: airport?.name || "",
      code: airport?.code || "",
      city: airport?.city || "",
      country: airport?.country || "",
      imageUrl: airport?.imageUrl || "",
    },
  });

  // Handle form submission
  const handleSubmit = (values: z.infer<typeof airportFormSchema>) => {
    // If we're creating a new airport, generate ID
    const submissionData = airport 
      ? { ...values, id: airport.id }
      : { ...values, id: Math.floor(Math.random() * 1000) };
    
    onSubmit(submissionData);
  };

  // Handle image URL change
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    form.setValue("imageUrl", url);
  };

  const isEditing = !!airport;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            {/* Airport Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Airport Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Heathrow Airport" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Airport Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Airport Code</FormLabel>
                  <FormControl>
                    <Input placeholder="LHR" maxLength={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="London" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="United Kingdom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            {/* Image URL */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/airport-image.jpg" 
                      value={field.value || ""}
                      onChange={handleImageUrlChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Preview */}
            <div className="mt-4 border rounded-md overflow-hidden">
              {imageUrl ? (
                <div className="relative aspect-video bg-muted">
                  <img
                    src={imageUrl}
                    alt="Airport preview"
                    className="w-full h-full object-cover transition-opacity duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground">
                  No image provided
                </div>
              )}
            </div>
          </div>
        </div>

        <FormActions isEditing={isEditing} isLoading={isLoading} />
      </form>
    </Form>
  );
}
