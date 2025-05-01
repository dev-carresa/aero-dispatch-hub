import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoleData, RoleOperationType } from "@/types/permission";

interface RoleOperationDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  operationType: RoleOperationType;
  selectedRole: RoleData | null;
  editingRole: RoleData | null;
  setEditingRole: (role: RoleData | null) => void;
  copiedRoleName: string;
  setCopiedRoleName: (name: string) => void;
  onEditRole: () => void;
  onCopyRole: () => void;
}

export const RoleOperationDialog: React.FC<RoleOperationDialogProps> = ({
  isOpen,
  setIsOpen,
  operationType,
  selectedRole,
  editingRole,
  setEditingRole,
  copiedRoleName,
  setCopiedRoleName,
  onEditRole,
  onCopyRole
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {operationType === 'edit' ? 'Modifier le Rôle' : 'Dupliquer le Rôle'}
          </DialogTitle>
          <DialogDescription>
            {operationType === 'edit' 
              ? 'Modifiez les détails du rôle sélectionné.'
              : 'Créez un nouveau rôle basé sur celui-ci.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role-op-name">Nom du Rôle</Label>
            <Input 
              id="role-op-name"
              value={operationType === 'edit' 
                ? editingRole?.name || '' 
                : copiedRoleName}
              onChange={(e) => {
                if (operationType === 'edit' && editingRole) {
                  setEditingRole({...editingRole, name: e.target.value});
                } else {
                  setCopiedRoleName(e.target.value);
                }
              }}
              placeholder="Nom du rôle"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role-op-description">Description</Label>
            <Input 
              id="role-op-description"
              value={operationType === 'edit' 
                ? editingRole?.description || '' 
                : `Copy of ${selectedRole?.name || ''}`}
              onChange={(e) => {
                if (operationType === 'edit' && editingRole) {
                  setEditingRole({...editingRole, description: e.target.value});
                }
                // For copy, we keep the default description
              }}
              placeholder="Description du rôle"
              disabled={operationType === 'copy'}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
          <Button 
            onClick={operationType === 'edit' ? onEditRole : onCopyRole}
          >
            {operationType === 'edit' ? 'Enregistrer' : 'Dupliquer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
