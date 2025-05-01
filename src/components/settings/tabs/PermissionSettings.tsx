
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, User, Search } from "lucide-react";
import { useRolesAndPermissions } from "@/hooks/useRolesAndPermissions";
import { RoleData } from "@/types/permission";
import { CreateRoleDialog } from "../permissions/CreateRoleDialog";
import { RolesList } from "../permissions/RolesList";
import { UserRoleTab } from "../permissions/UserRoleTab";
import { RoleOperationDialog } from "../permissions/RoleOperationDialog";

export function PermissionSettings() {
  // Role operation states
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [isRoleOpDialogOpen, setIsRoleOpDialogOpen] = useState(false);
  const [roleOpType, setRoleOpType] = useState<'edit' | 'copy'>('edit');
  const [copiedRoleName, setCopiedRoleName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [confirmDeleteRoleId, setConfirmDeleteRoleId] = useState<string | null>(null);
  
  // Initialize roles and permissions hook
  const {
    roles,
    users,
    isLoading,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    filteredRoles,
    filteredUsers,
    handleRolePermissionChange,
    handleCategoryPermissionChange,
    handleUserRoleChange,
    handleDeleteRole,
    handleCreateRole,
    handleEditRole,
    handleCopyRole,
    saveUserPermissions,
    saveRolePermissions,
    countEnabledPermissionsInCategory,
    areAllPermissionsEnabledInCategory,
  } = useRolesAndPermissions();

  // Handle edit button click
  const handleEditClick = (role: RoleData) => {
    setEditingRole(role);
    setRoleOpType('edit');
    setIsRoleOpDialogOpen(true);
  };

  // Handle copy button click
  const handleCopyClick = (role: RoleData) => {
    setSelectedRole(role);
    setRoleOpType('copy');
    setCopiedRoleName(`${role.name} Copy`);
    setIsRoleOpDialogOpen(true);
  };

  // Handle save button click
  const handleSaveClick = (role: RoleData) => {
    saveRolePermissions(role);
  };

  // Handle edit role submission
  const handleEditRoleSubmit = async () => {
    if (editingRole) {
      const success = await handleEditRole(editingRole);
      if (success) {
        setIsRoleOpDialogOpen(false);
        setEditingRole(null);
      }
    }
  };

  // Handle copy role submission
  const handleCopyRoleSubmit = async () => {
    if (selectedRole) {
      const success = await handleCopyRole(selectedRole, copiedRoleName);
      if (success) {
        setIsRoleOpDialogOpen(false);
        setSelectedRole(null);
        setCopiedRoleName("");
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
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
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList className="grid grid-cols-2 w-full sm:w-auto">
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Gestion des Rôles</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Attribution des Rôles</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <CreateRoleDialog 
              isOpen={isCreateDialogOpen} 
              setIsOpen={setIsCreateDialogOpen}
              onCreateRole={handleCreateRole}
            />
          </div>
        </div>

        <TabsContent value="roles" className="space-y-6">
          <RolesList 
            roles={filteredRoles}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            confirmDeleteRoleId={confirmDeleteRoleId}
            setConfirmDeleteRoleId={setConfirmDeleteRoleId}
            onDeleteRole={handleDeleteRole}
            onEditClick={handleEditClick}
            onCopyClick={handleCopyClick}
            onSaveClick={handleSaveClick}
            onRolePermissionChange={handleRolePermissionChange}
            onCategoryPermissionChange={handleCategoryPermissionChange}
            countEnabledPermissionsInCategory={countEnabledPermissionsInCategory}
            areAllPermissionsEnabledInCategory={areAllPermissionsEnabledInCategory}
          />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserRoleTab 
            users={users}
            roles={roles}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onUserRoleChange={handleUserRoleChange}
            onSavePermissions={saveUserPermissions}
          />
        </TabsContent>
      </Tabs>
      
      {/* Role Operations Dialog (Edit & Copy) */}
      <RoleOperationDialog 
        isOpen={isRoleOpDialogOpen}
        setIsOpen={setIsRoleOpDialogOpen}
        operationType={roleOpType}
        selectedRole={selectedRole}
        editingRole={editingRole}
        setEditingRole={setEditingRole}
        copiedRoleName={copiedRoleName}
        setCopiedRoleName={setCopiedRoleName}
        onEditRole={handleEditRoleSubmit}
        onCopyRole={handleCopyRoleSubmit}
      />
    </div>
  );
}
