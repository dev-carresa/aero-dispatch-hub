
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoleData } from "../types";

interface RoleOperationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'edit' | 'copy';
  role: RoleData | null;
  onEdit: (role: RoleData) => void;
  onCopy: (roleName: string) => void;
  isSaving: boolean;
}

export function RoleOperationDialog({
  open,
  onOpenChange,
  type,
  role,
  onEdit,
  onCopy,
  isSaving
}: RoleOperationDialogProps) {
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');

  useEffect(() => {
    if (role) {
      setRoleName(type === 'edit' ? role.name : `${role.name} Copy`);
      setRoleDescription(type === 'edit' ? role.description || '' : `Copy of ${role.name}`);
    }
  }, [role, type]);

  const handleSubmit = () => {
    if (!role || !roleName.trim()) return;

    if (type === 'edit') {
      const updatedRole = { ...role, name: roleName, description: roleDescription };
      onEdit(updatedRole);
    } else {
      onCopy(roleName);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'edit' ? 'Modifier le Rôle' : 'Dupliquer le Rôle'}
          </DialogTitle>
          <DialogDescription>
            {type === 'edit' 
              ? 'Modifiez les détails du rôle sélectionné.'
              : 'Créez un nouveau rôle basé sur celui-ci.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role-op-name">Nom du Rôle</Label>
            <Input 
              id="role-op-name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Nom du rôle"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role-op-description">Description</Label>
            <Input 
              id="role-op-description"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              placeholder="Description du rôle"
              disabled={type === 'copy'}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSaving || !roleName.trim()}
          >
            {isSaving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></div>
            ) : null}
            {type === 'edit' ? 'Enregistrer' : 'Dupliquer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
