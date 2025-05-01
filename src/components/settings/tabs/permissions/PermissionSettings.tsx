
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, User } from "lucide-react";
import { useRolesManager } from "./hooks/useRolesManager";
import { RolesTab } from "./components/RolesTab";
import { UsersTab } from "./components/UsersTab";
import { usePermission } from "@/context/PermissionContext";

export function PermissionSettings() {
  const { loadingPermissions } = usePermission();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    roles,
    users,
    isLoading,
    isSaving,
    handleRolePermissionChange,
    handleCategoryPermissionChange,
    handleUserRoleChange,
    handleDeleteRole,
    handleCreateRole,
    handleCopyRole,
    saveRolePermissions,
    saveUserPermissions
  } = useRolesManager();

  // Show loading state
  if (isLoading || loadingPermissions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement des permissions...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Chargement des rôles et des permissions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 animate-in fade-in duration-300">
      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid grid-cols-2 w-full sm:w-auto mb-6">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Gestion des Rôles</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Attribution des Rôles</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <RolesTab 
            roles={roles}
            isLoading={isLoading}
            isSaving={isSaving}
            handleRolePermissionChange={handleRolePermissionChange}
            handleCategoryPermissionChange={handleCategoryPermissionChange}
            handleDeleteRole={handleDeleteRole}
            handleCreateRole={handleCreateRole}
            handleCopyRole={handleCopyRole}
            saveRolePermissions={saveRolePermissions}
          />
        </TabsContent>

        <TabsContent value="users">
          <UsersTab 
            users={users}
            roles={roles}
            onUserRoleChange={handleUserRoleChange}
            onSave={saveUserPermissions}
            isSaving={isSaving}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
