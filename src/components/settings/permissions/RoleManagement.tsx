
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SimpleRole, permissionCategories, formatPermissionName } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface RoleManagementProps {
  roles: SimpleRole[];
  setRoles: React.Dispatch<React.SetStateAction<SimpleRole[]>>;
  dbMode: boolean;
  dbError: string | null;
}

export function RoleManagement({ roles, setRoles, dbMode, dbError }: RoleManagementProps) {
  const [newRoleName, setNewRoleName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  const handleRolePermissionChange = async (roleId: string, permissionKey: string, value: boolean) => {
    try {
      if (dbMode) {
        if (value) {
          // Add permission to role using edge function
          await supabase.functions.invoke('add_permission_to_role_by_name', { 
            body: { p_role_id: roleId, p_permission_name: permissionKey }
          });
        } else {
          // Remove permission from role using edge function
          await supabase.functions.invoke('remove_permission_from_role_by_name', { 
            body: { p_role_id: roleId, p_permission_name: permissionKey }
          });
        }
      }
      
      // Update UI state
      setRoles(roles.map(role => {
        if (role.id === roleId) {
          return {
            ...role,
            permissions: {
              ...role.permissions,
              [permissionKey]: value
            }
          };
        }
        return role;
      }));
    } catch (error) {
      console.error("Error updating role permission:", error);
      toast.error("Failed to update permission. Please try again.");
    }
  };

  const deleteRole = async (roleId: string) => {
    try {
      // Check if role is in use (this would be checked through a prop passed in from parent)
      const roleInUse = false; // This should be determined by checking users
      
      if (roleInUse) {
        toast.error("Cannot delete role that is assigned to users");
        return;
      }
      
      if (dbMode) {
        // Delete role using edge function
        await supabase.functions.invoke('delete_role', { 
          body: { p_role_id: roleId }
        });
      }
      
      // Update UI state
      setRoles(roles.filter(role => role.id !== roleId));
      toast.success("Role deleted successfully");
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role. Please try again.");
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      toast.error("Role name cannot be empty");
      return;
    }
    
    try {
      // Check if role with this name already exists
      if (roles.some(role => role.name.toLowerCase() === newRoleName.toLowerCase())) {
        toast.error("A role with a similar name already exists");
        return;
      }
      
      let newRoleId = "";
      
      if (dbMode) {
        // Create role using edge function
        const { data } = await supabase.functions.invoke('create_role', {
          body: { p_name: newRoleName, p_description: `Custom role: ${newRoleName}` }
        });
        
        if (typeof data === 'string') {
          newRoleId = data;
        } else {
          throw new Error("Invalid response from create_role");
        }
      } else {
        // Generate a UUID-like string for memory mode
        newRoleId = 'custom_' + Math.random().toString(36).substring(2, 15);
      }
      
      // Create empty permissions object
      const permissions: Record<string, boolean> = {};
      
      // Initialize all permissions as false
      Object.values(permissionCategories).flat().forEach(perm => {
        permissions[perm] = false;
      });
      
      // Add the new role
      const newRole: SimpleRole = {
        id: newRoleId,
        name: newRoleName,
        permissions,
        isBuiltIn: false
      };
      
      setRoles([...roles, newRole]);
      setNewRoleName("");
      setIsCreateDialogOpen(false);
      toast.success(`Role "${newRoleName}" created successfully`);
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Failed to create role. Please try again.");
    }
  };

  return (
    <Card className="hover-scale shadow-sm card-gradient">
      <CardHeader>
        <CardTitle>Role Management</CardTitle>
        <CardDescription>Configure user roles and permissions.</CardDescription>
      </CardHeader>
      <CardContent>
        {dbError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Error</AlertTitle>
            <AlertDescription>{dbError}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-6">
          {roles.map((role) => (
            <div key={role.id} className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{role.name}</h3>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingRoleId(role.id)}
                    disabled={role.isBuiltIn}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    disabled={role.isBuiltIn}
                    onClick={() => deleteRole(role.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                {Object.entries(permissionCategories).map(([category, permissions]) => (
                  <div key={category}>
                    <h4 className="font-medium mb-2">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {permissions.map((permKey) => (
                        <div key={permKey} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id={`${role.id}-${permKey}`}
                            checked={role.permissions[permKey] || false}
                            disabled={role.isBuiltIn && dbMode}
                            onChange={(e) => handleRolePermissionChange(role.id, permKey, e.target.checked)}
                            className="h-4 w-4" 
                          />
                          <Label htmlFor={`${role.id}-${permKey}`}>
                            {formatPermissionName(permKey)}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create New Role</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Enter a name for the new role. You'll be able to configure permissions after creation.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="role-name" className="block mb-2">Role Name</Label>
                <Input 
                  id="role-name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Enter role name"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateRole}>Create Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
