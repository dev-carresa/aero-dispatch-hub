
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ApiUser, ServiceType } from "@/types/apiUser";
import { ApiKeyDisplay } from "./ApiKeyDisplay";
import { AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { RefreshCw } from "lucide-react";

// Form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().min(2, {
    message: "Please select a country.",
  }),
  serviceType: z.enum(["api_access", "white_label", "both"]),
  status: z.enum(["active", "inactive"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ApiUserFormProps {
  apiUser?: ApiUser;
  onSubmit: (data: FormValues & { apiKey: string; secretKey?: string }) => void;
  isLoading?: boolean;
}

// Function to generate random API key
const generateKey = (prefix: string, length: number = 24) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export function ApiUserForm({ apiUser, onSubmit, isLoading }: ApiUserFormProps) {
  const [apiKey, setApiKey] = useState<string>(apiUser?.apiKey || generateKey("uk_", 20));
  const [secretKey, setSecretKey] = useState<string>(apiUser?.secretKey || generateKey("sk_", 24));
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false);
  
  const isEditing = !!apiUser;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: apiUser?.name || "",
      email: apiUser?.email || "",
      company: apiUser?.company || "",
      phone: apiUser?.phone || "",
      country: apiUser?.country || "",
      serviceType: apiUser?.serviceType || "api_access",
      status: apiUser?.status || "active",
      notes: apiUser?.notes || "",
    },
  });

  const handleRegenerateKeys = () => {
    setApiKey(generateKey("uk_", 20));
    setSecretKey(generateKey("sk_", 24));
    setIsRegenerateDialogOpen(false);
  };

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      ...values,
      apiKey,
      secretKey,
    });
  };

  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", 
    "Germany", "France", "Spain", "Italy", "Japan", "China",
    "South Korea", "India", "Brazil", "Mexico", "South Africa"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">User Information</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Company Ltd." {...field} />
                  </FormControl>
                  <FormDescription>Optional company or organization name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormDescription>Optional contact phone number</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Service Access</h3>
            
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange as (value: string) => void} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="api_access">API Access</SelectItem>
                      <SelectItem value="white_label">White Label</SelectItem>
                      <SelectItem value="both">Both Services</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Type of service this user is authorized to access
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      {field.value === "active"
                        ? "User currently has access to services"
                        : "User access is currently disabled"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === "active"}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? "active" : "inactive")
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">API Credentials</h3>
                {isEditing && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsRegenerateDialogOpen(true)}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate Keys
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                <ApiKeyDisplay apiKey={apiKey} label="API Key" />
                <ApiKeyDisplay apiKey={secretKey} label="Secret Key" />
              </div>
              
              <p className="text-sm text-muted-foreground mt-2">
                {isEditing
                  ? "These credentials grant access to your API. Keep them secure."
                  : "New API credentials will be generated. Store them securely as the Secret Key won't be shown again."}
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional information about this API user..."
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional notes for internal reference
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update" : "Create"} API User
          </Button>
        </div>
      </form>
      
      <AlertDialog open={isRegenerateDialogOpen} onOpenChange={setIsRegenerateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate API Credentials</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to regenerate API credentials for this user?
              This will invalidate the existing credentials and may disrupt service.
              Make sure to communicate the new credentials to the API user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRegenerateKeys}>Regenerate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
}
