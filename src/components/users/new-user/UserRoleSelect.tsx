
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";
import { FormValues } from "./UserForm";

interface UserRoleSelectProps {
  control: Control<FormValues>;
  initialValue: string;
  onRoleChange: (value: string) => void;
}

export const UserRoleSelect = ({ initialValue, onRoleChange }: UserRoleSelectProps) => {
  return (
    <FormItem>
      <FormLabel>Role</FormLabel>
      <Select 
        onValueChange={onRoleChange} 
        defaultValue={initialValue}
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
  );
};
