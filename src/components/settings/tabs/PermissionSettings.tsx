
import { useState } from "react";
import { usePermission } from "@/context/PermissionContext";
import { DatabaseInitializer } from "../DatabaseInitializer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RoleManagement } from "../permissions/RoleManagement";
import { UserPermissions } from "../permissions/UserPermissions";
import { usePermissionSettings } from "../permissions/usePermissionSettings";

export function PermissionSettings() {
  const { hasPermission, isAdmin } = usePermission();
  const {
    roles,
    setRoles,
    users,
    setUsers,
    isLoading,
    dbMode,
    dbError,
  } = usePermissionSettings();

  // Only admins with permissions:settings permission can access this page
  if (!hasPermission("settings:permissions") && !isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permission Settings</CardTitle>
          <CardDescription>
            You don't have permission to view or modify permissions.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading permissions...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <Tabs defaultValue="roles">
        <TabsList className="mb-4">
          <TabsTrigger value="roles">Role Management</TabsTrigger>
          <TabsTrigger value="users">User Permissions</TabsTrigger>
          <TabsTrigger value="admin">Admin Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles">
          <RoleManagement 
            roles={roles} 
            setRoles={setRoles} 
            dbMode={dbMode} 
            dbError={dbError}
          />
        </TabsContent>
        
        <TabsContent value="users">
          <UserPermissions 
            users={users} 
            setUsers={setUsers} 
            roles={roles} 
            dbMode={dbMode}
          />
        </TabsContent>
        
        <TabsContent value="admin">
          <DatabaseInitializer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
