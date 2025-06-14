
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { FileInput } from "@/components/ui/file-input";
import { FormPhoneInput } from "@/components/ui/phone-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import { UserRoleSelect } from "./UserRoleSelect";
import { DriverFields } from "./DriverFields";

// Define form schema with conditional fields
const baseSchema = {
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["Admin", "Driver", "Dispatcher", "Fleet", "Customer"]),
  status: z.enum(["active", "inactive"]),
  profileImage: z.instanceof(FileList).optional().refine(
    (files) => !files || files.length === 0 || Array.from(files).every(file => 
      ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
    ),
    "Only .jpg, .png, and .gif formats are supported."
  ),
};

const driverSchema = {
  ...baseSchema,
  phone: z.string()
    .refine((value) => !value || isValidPhoneNumber(value), 
      { message: "Please enter a valid phone number" }),
  nationality: z.string().min(2, "Nationality is required"),
  dateOfBirth: z.string(),
  vehicleType: z.enum(["sedan", "suv", "van", "truck"]),
  driverAvailability: z.enum(["available", "busy", "offline", "on_break"]),
};

// We'll create a dynamic schema based on the selected role
const formSchema = z.object(baseSchema).superRefine((data, ctx) => {
  if (data.role === "Driver") {
    const driverValidation = z.object(driverSchema).safeParse(data);
    
    if (!driverValidation.success) {
      driverValidation.error.errors.forEach((error) => {
        if (error.path[0] !== "role" && error.path[0] !== "firstName" && 
            error.path[0] !== "lastName" && error.path[0] !== "email" && 
            error.path[0] !== "password" && error.path[0] !== "status") {
          ctx.addIssue(error);
        }
      });
    }
  }
  
  return z.NEVER;
});

export type FormValues = z.infer<typeof formSchema> & {
  phone?: string;
  nationality?: string;
  dateOfBirth?: string;
  vehicleType?: "sedan" | "suv" | "van" | "truck";
  driverAvailability?: "available" | "busy" | "offline" | "on_break";
  profileImage?: FileList;
};

interface UserFormProps {
  initialRole: string;
  onRoleChange: (role: string) => void;
}

export const UserForm = ({ initialRole, onRoleChange }: UserFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      role: initialRole as any,
      status: "active",
      driverAvailability: "available",
    },
  });

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      form.setValue("profileImage", files);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Create an imageUrl from the uploaded file if it exists
    let imageUrl = "";
    if (data.profileImage && data.profileImage[0]) {
      // In a real app, we would upload to a server and get back a URL
      // For demo purposes, we'll just use the file name
      imageUrl = URL.createObjectURL(data.profileImage[0]);
    }
    
    // Simulate API call with timeout
    setTimeout(() => {
      const userData = {
        ...data,
        name: `${data.firstName} ${data.lastName}`,
        imageUrl: imageUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(`${data.firstName} ${data.lastName}`),
      };
      
      console.log("User data submitted:", userData);
      toast.success(`${data.role} created successfully`);
      setIsSubmitting(false);
      navigate("/users");
    }, 1000);
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    form.setValue("role", role as any);
    onRoleChange(role);
  };

  const isDriverForm = selectedRole === "Driver";

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="profileImage"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <FormControl>
                  <FileInput
                    accept="image/*"
                    previewUrl={profileImageUrl}
                    onChange={handleProfileImageChange}
                    {...fieldProps}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid gap-4 grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="user@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <UserRoleSelect 
                control={form.control} 
                initialValue={field.value}
                onRoleChange={handleRoleChange} 
              />
            )}
          />
          
          {isDriverForm && (
            <DriverFields 
              control={form.control}
            />
          )}
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Active Status</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    {isDriverForm ? 'Set driver as active' : 'Set user as active'}
                  </p>
                </div>
                <FormControl>
                  <Switch 
                    checked={field.value === "active"} 
                    onCheckedChange={(checked) => field.onChange(checked ? "active" : "inactive")}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : `Create ${isDriverForm ? "Driver" : "User"}`}
          </Button>
        </form>
      </Form>
    </div>
  );
};
