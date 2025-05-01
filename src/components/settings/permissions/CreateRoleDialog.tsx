
import React, { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface CreateRoleDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onCreateRole: (name: string, description?: string) => Promise<boolean>;
}

export const CreateRoleDialog: React.FC<CreateRoleDialogProps> = ({ 
  isOpen, 
  setIsOpen,
  onCreateRole
}) => {
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");

  const handleCreate = async () => {
    const success = await onCreateRole(newRoleName, newRoleDescription);
    if (success) {
      setNewRoleName("");
      setNewRoleDescription("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
          <Button onClick={handleCreate}>Créer Rôle</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
