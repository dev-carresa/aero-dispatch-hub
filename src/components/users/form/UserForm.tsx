
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { FileInput } from "@/components/ui/file-input";
import { FormPhoneInput } from "@/components/ui/phone-input";
import { DriverFormFields } from "./DriverFormFields";
import { UserFormValues, userFormSchema } from "@/schemas/userFormSchema";

interface UserFormProps {
  initialRole?: string;
}

export function UserForm({ initialRole = "Driver" }: UserFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
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

  const onSubmit = async (data: UserFormValues) => {
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
        
        {isDriverForm && <DriverFormFields control={form.control} />}
        
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
  );
}
