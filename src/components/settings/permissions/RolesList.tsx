
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RoleCard } from "./RoleCard";
import { RoleData } from "@/types/permission";

interface RolesListProps {
  roles: RoleData[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  confirmDeleteRoleId: string | null;
  setConfirmDeleteRoleId: (id: string | null) => void;
  onDeleteRole: (roleId: string) => void;
  onEditClick: (role: RoleData) => void;
  onCopyClick: (role: RoleData) => void;
  onSaveClick: (role: RoleData) => void;
  onRolePermissionChange: (roleId: string, permissionKey: string, value: boolean) => void;
  onCategoryPermissionChange: (roleId: string, category: string, value: boolean) => void;
  countEnabledPermissionsInCategory: (role: RoleData, category: string) => number;
  areAllPermissionsEnabledInCategory: (role: RoleData, category: string) => boolean;
}

export const RolesList: React.FC<RolesListProps> = ({
  roles,
  searchQuery,
  setSearchQuery,
  confirmDeleteRoleId,
  setConfirmDeleteRoleId,
  onDeleteRole,
  onEditClick,
  onCopyClick,
  onSaveClick,
  onRolePermissionChange,
  onCategoryPermissionChange,
  countEnabledPermissionsInCategory,
  areAllPermissionsEnabledInCategory
}) => {
  // Filter roles by search query
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Find the role being deleted (for confirmation dialog)
  const roleBeingDeleted = roles.find(r => r.id === confirmDeleteRoleId);

  return (
    <div className="space-y-6">
      {filteredRoles.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          onDeleteRole={onDeleteRole}
          onEditClick={onEditClick}
          onCopyClick={onCopyClick}
          onSaveClick={onSaveClick}
          onRolePermissionChange={onRolePermissionChange}
          onCategoryPermissionChange={onCategoryPermissionChange}
          countEnabledPermissionsInCategory={countEnabledPermissionsInCategory}
          areAllPermissionsEnabledInCategory={areAllPermissionsEnabledInCategory}
          confirmDeleteRoleId={confirmDeleteRoleId}
          setConfirmDeleteRoleId={setConfirmDeleteRoleId}
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

      {/* Delete Role Confirmation Dialog */}
      <AlertDialog 
        open={confirmDeleteRoleId !== null} 
        onOpenChange={(open) => !open && setConfirmDeleteRoleId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le rôle</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le rôle <strong>{roleBeingDeleted?.name}</strong>? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => confirmDeleteRoleId && onDeleteRole(confirmDeleteRoleId)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
