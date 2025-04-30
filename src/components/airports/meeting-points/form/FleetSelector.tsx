
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { User, UserRole } from "@/types/user";

interface FleetSelectorProps {
  form: UseFormReturn<any>;
  currentUser: User;
}

// Sample fleets data for dropdown
const FLEETS = [
  { id: 1, name: "Executive Fleet" },
  { id: 2, name: "Standard Fleet" },
  { id: 3, name: "Premium Fleet" },
];

export function FleetSelector({ form, currentUser }: FleetSelectorProps) {
  const isAdmin = currentUser.role === "Admin";

  if (!isAdmin) return null;

  return (
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
  );
}
