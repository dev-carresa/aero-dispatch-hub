import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { FileInput } from "@/components/ui/file-input";
import { FormPhoneInput } from "@/components/ui/phone-input";
import { isValidPhoneNumber } from "react-phone-number-input";

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

type FormValues = z.infer<typeof formSchema> & {
  phone?: string;
  nationality?: string;
  dateOfBirth?: string;
  vehicleType?: "sedan" | "suv" | "van" | "truck";
  driverAvailability?: "available" | "busy" | "offline" | "on_break";
  profileImage?: FileList;
};

const NewUser = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "Driver";
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
  };

  const isDriverForm = selectedRole === "Driver";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button onClick={() => navigate("/users")} variant="outline" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          Create New {isDriverForm ? "Driver" : "User"}
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleRoleChange(value);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Driver">Driver</SelectItem>
                        <SelectItem value="Dispatcher">Dispatcher</SelectItem>
                        <SelectItem value="Fleet">Fleet</SelectItem>
                        <SelectItem value="Customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {isDriverForm && (
                <>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormPhoneInput
                          control={form.control}
                          name="phone"
                          label="Phone Number"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid gap-4 grid-cols-2">
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. American" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sedan">Sedan</SelectItem>
                            <SelectItem value="suv">SUV</SelectItem>
                            <SelectItem value="van">Van</SelectItem>
                            <SelectItem value="truck">Truck</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="driverAvailability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Availability</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select availability" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="busy">Busy</SelectItem>
                            <SelectItem value="on_break">On Break</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
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
        
        <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">{isDriverForm ? "Driver" : "User"} Information</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {isDriverForm 
              ? 'Drivers are responsible for handling trips and transporting passengers.' 
              : 'Adding a new user will allow them to access the system according to their role permissions.'}
          </p>
          <div className="space-y-4">
            {isDriverForm ? (
              <>
                <div>
                  <h4 className="font-medium">Driver Details</h4>
                  <p className="text-sm text-muted-foreground">
                    Provide accurate driver information including contact details and vehicle type.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Vehicle Assignment</h4>
                  <p className="text-sm text-muted-foreground">
                    Select the vehicle type the driver is authorized to operate.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Availability Status</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the initial availability status for the driver.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h4 className="font-medium">Admin</h4>
                  <p className="text-sm text-muted-foreground">Full access to all system features and user management.</p>
                </div>
                <div>
                  <h4 className="font-medium">Driver</h4>
                  <p className="text-sm text-muted-foreground">Access to bookings assigned to them and trip management.</p>
                </div>
                <div>
                  <h4 className="font-medium">Dispatcher</h4>
                  <p className="text-sm text-muted-foreground">Booking management and driver assignment capabilities.</p>
                </div>
                <div>
                  <h4 className="font-medium">Fleet</h4>
                  <p className="text-sm text-muted-foreground">Access to view bookings, assign drivers, and view reports.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
