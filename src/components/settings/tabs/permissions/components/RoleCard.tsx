
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Copy, Save, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { RoleData, permissionCategories } from "../types";
import { PermissionCategory } from "./PermissionCategory";

interface RoleCardProps {
  role: RoleData;
  onPermissionChange: (roleId: string, permissionKey: string, value: boolean) => void;
  onCategoryChange: (roleId: string, category: string, value: boolean) => void;
  onEdit: (role: RoleData) => void;
  onCopy: (role: RoleData) => void;
  onDelete: (roleId: string) => void;
  onSave: (role: RoleData) => void;
  isSaving: boolean;
}

export function RoleCard({
  role,
  onPermissionChange,
  onCategoryChange,
  onEdit,
  onCopy,
  onDelete,
  onSave,
  isSaving
}: RoleCardProps) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  return (
    <Card 
      key={role.id} 
      className="overflow-hidden border-l-4 transition-all hover:shadow-md" 
      style={{ borderLeftColor: role.isBuiltIn ? 'var(--primary)' : 'var(--muted)' }}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{role.name}</CardTitle>
              {role.isBuiltIn && (
                <Badge variant="outline" className="font-normal">
                  Système
                </Badge>
              )}
              {role.userCount !== undefined && role.userCount > 0 && (
                <Badge variant="secondary" className="font-normal">
                  {role.userCount} utilisateur{role.userCount > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <CardDescription>{role.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => onCopy(role)}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Dupliquer</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Dupliquer ce rôle</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(role)}
                    disabled={role.isBuiltIn}
                  >
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Éditer les détails</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Éditer les détails du rôle</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      disabled={role.isBuiltIn || (role.userCount !== undefined && role.userCount > 0)}
                      onClick={() => setConfirmDeleteOpen(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Supprimer ce rôle</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer le rôle</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer le rôle <strong>{role.name}</strong>? Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setConfirmDeleteOpen(false)}>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-red-500 text-white hover:bg-red-600"
                    onClick={() => {
                      onDelete(role.id);
                      setConfirmDeleteOpen(false);
                    }}
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button 
              onClick={() => onSave(role)}
              size="sm"
              disabled={isSaving || role.isBuiltIn}
            >
              {isSaving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              <span>Sauvegarder</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          <Accordion type="multiple" className="w-full">
            {Object.keys(permissionCategories).map((category) => (
              <PermissionCategory 
                key={`${role.id}-${category}`}
                role={role}
                category={category}
                onCategoryToggle={onCategoryChange}
                onPermissionToggle={onPermissionChange}
              />
            ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
