
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface MeetingPointBasicInfoProps {
  form: UseFormReturn<any>;
}

export function MeetingPointBasicInfo({ form }: MeetingPointBasicInfoProps) {
  return (
    <>
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
    </>
  );
}
