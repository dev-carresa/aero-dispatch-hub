
import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { FormPhoneInput } from "@/components/ui/phone-input";
import { UserFormValues } from "@/schemas/userFormSchema";

interface DriverFormFieldsProps {
  control: Control<UserFormValues>;
}

export function DriverFormFields({ control }: DriverFormFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormPhoneInput
              control={control}
              name="phone"
              label="Phone Number"
            />
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid gap-4 grid-cols-2">
        <FormField
          control={control}
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
          control={control}
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
        control={control}
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
        control={control}
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
  );
}
