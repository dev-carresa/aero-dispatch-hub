
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { SimpleRole, SimpleUser } from "./types";
import { supabase } from "@/integrations/supabase/client";

interface UserPermissionsProps {
  users: SimpleUser[];
  setUsers: React.Dispatch<React.SetStateAction<SimpleUser[]>>;
  roles: SimpleRole[];
  dbMode: boolean;
}

export function UserPermissions({ users, setUsers, roles, dbMode }: UserPermissionsProps) {
  const handleUserRoleChange = async (userId: string, newRoleValue: string) => {
    try {
      if (dbMode) {
        // Update user role using edge function
        await supabase.functions.invoke('update_user_role_by_name', { 
          body: { p_user_id: userId, p_role_name: newRoleValue.charAt(0).toUpperCase() + newRoleValue.slice(1) }
        });
      }
      
      // Update UI state
      setUsers(users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            role: newRoleValue
          };
        }
        return user;
      }));
      
      toast.success("User role updated successfully");
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role. Please try again.");
    }
  };

  return (
    <Card className="hover-scale shadow-sm card-gradient">
      <CardHeader>
        <CardTitle>User Permissions</CardTitle>
        <CardDescription>Assign roles to specific users.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full bg-${user.color}-100 flex items-center justify-center text-${user.color}-700 font-medium`}>
                    {user.initials}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <select
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                  value={user.role}
                  onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.name.toLowerCase()}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
