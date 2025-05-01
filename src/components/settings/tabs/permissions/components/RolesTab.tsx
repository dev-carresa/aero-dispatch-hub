
import { useState } from "react";
import { Search, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RoleData } from "../types";
import { RoleCard } from "./RoleCard";
import { RoleOperationDialog } from "./RoleOperationDialog";

interface RolesTabProps {
  roles: RoleData[];
  isLoading: boolean;
  isSaving: boolean;
  handleRolePermissionChange: (roleId: string, permissionKey: string, value: boolean) => void;
  handleCategoryPermissionChange: (roleId: string, category: string, value: boolean) => void;
  handleDeleteRole: (roleId: string) => Promise<boolean>;
  handleCreateRole: (name: string, description: string) => Promise<RoleData | null>;
  handleCopyRole: (selectedRole: RoleData, copiedRoleName: string) => Promise<RoleData | null>;
  saveRolePermissions: (role: RoleData) => Promise<boolean>;
}

export function RolesTab({
  roles,
  isLoading,
  isSaving,
  handleRolePermissionChange,
  handleCategoryPermissionChange,
  handleDeleteRole,
  handleCreateRole,
  handleCopyRole,
  saveRolePermissions
}: RolesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const [roleOpDialogOpen, setRoleOpDialogOpen] = useState(false);
  const [roleOpType, setRoleOpType] = useState<'edit' | 'copy'>('edit');

  // Filter roles by search query
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateRoleSubmit = async () => {
    const result = await handleCreateRole(newRoleName, newRoleDescription);
    if (result) {
      setNewRoleName("");
      setNewRoleDescription("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleOpenCopyDialog = (role: RoleData) => {
    setSelectedRole(role);
    setRoleOpType('copy');
    setRoleOpDialogOpen(true);
  };

  const handleOpenEditDialog = (role: RoleData) => {
    setSelectedRole(role);
    setRoleOpType('edit');
    setRoleOpDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Chargement des rôles et des permissions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
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

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              <span className="hidden sm:inline">Nouveau Rôle</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un Nouveau Rôle</DialogTitle>
              <DialogDescription>
                Entrez les informations pour le nouveau rôle. Vous pourrez configurer les permissions après la création.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">Nom du Rôle</Label>
                <Input 
                  id="role-name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Ex: Support Technique"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-description">Description (optionnel)</Label>
                <Input 
                  id="role-description"
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  placeholder="Ex: Rôle pour l'équipe de support technique"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleCreateRoleSubmit}>Créer Rôle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {filteredRoles.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          onPermissionChange={handleRolePermissionChange}
          onCategoryChange={handleCategoryPermissionChange}
          onEdit={handleOpenEditDialog}
          onCopy={handleOpenCopyDialog}
          onDelete={handleDeleteRole}
          onSave={saveRolePermissions}
          isSaving={isSaving}
        />
      ))}

      {filteredRoles.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg">Aucun rôle trouvé</h3>
            <p className="text-muted-foreground text-center mt-2">
              Aucun rôle ne correspond à votre recherche. Essayez de modifier vos critères de recherche ou créez un nouveau rôle.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchQuery("")}
            >
              Effacer la recherche
            </Button>
          </CardContent>
        </Card>
      )}

      <RoleOperationDialog 
        open={roleOpDialogOpen}
        onOpenChange={setRoleOpDialogOpen}
        type={roleOpType}
        role={selectedRole}
        onEdit={() => {}} // Will be implemented later if needed
        onCopy={(roleName) => {
          if (selectedRole) handleCopyRole(selectedRole, roleName);
        }}
        isSaving={isSaving}
      />
    </div>
  );
}
