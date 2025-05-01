
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SimpleRole, permissionCategories, formatPermissionName } from "./types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface RoleEditorProps {
  role: SimpleRole;
  setRoles: React.Dispatch<React.SetStateAction<SimpleRole[]>>;
  dbMode: boolean;
  onBackClick: () => void;
}

export function RoleEditor({ role, setRoles, dbMode, onBackClick }: RoleEditorProps) {
  const handleRolePermissionChange = async (permissionKey: string, value: boolean) => {
    try {
      if (dbMode) {
        if (value) {
          // Add permission to role using edge function
          await supabase.functions.invoke('add_permission_to_role_by_name', { 
            body: { p_role_id: role.id, p_permission_name: permissionKey }
          });
        } else {
          // Remove permission from role using edge function
          await supabase.functions.invoke('remove_permission_from_role_by_name', { 
            body: { p_role_id: role.id, p_permission_name: permissionKey }
          });
        }
      }
      
      // Update UI state
      setRoles(prevRoles => prevRoles.map(r => {
        if (r.id === role.id) {
          return {
            ...r,
            permissions: {
              ...r.permissions,
              [permissionKey]: value
            }
          };
        }
        return r;
      }));
    } catch (error) {
      console.error("Error updating role permission:", error);
      toast.error("Failed to update permission. Please try again.");
    }
  };

  return (
    <Card className="hover-scale shadow-sm card-gradient">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Edit Role: {role.name}</CardTitle>
            <CardDescription>Configure permissions for this role</CardDescription>
          </div>
          <Button variant="outline" onClick={onBackClick}>
            Back to Roles
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
                      onChange={(e) => handleRolePermissionChange(permKey, e.target.checked)}
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
      </CardContent>
    </Card>
  );
}
