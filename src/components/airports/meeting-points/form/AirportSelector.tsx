
import { Airport } from "@/types/airport";
import { sampleAirports } from "@/data/sampleAirports";
import {
  FormControl,
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

interface AirportSelectorProps {
  form: UseFormReturn<any>;
  isEditing: boolean;
}

export function AirportSelector({ form, isEditing }: AirportSelectorProps) {
  return (
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
  );
}
