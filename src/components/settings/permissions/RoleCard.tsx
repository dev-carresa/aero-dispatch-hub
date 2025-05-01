
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Copy, Trash2, Save } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RoleData } from "@/types/permission";
import { permissionCategories, permissionDescriptions } from "@/types/permission";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface RoleCardProps {
  role: RoleData;
  onDeleteRole: (roleId: string) => void;
  onEditClick: (role: RoleData) => void;
  onCopyClick: (role: RoleData) => void;
  onSaveClick: (role: RoleData) => void;
  onRolePermissionChange: (roleId: string, permissionKey: string, value: boolean) => void;
  onCategoryPermissionChange: (roleId: string, category: string, value: boolean) => void;
  countEnabledPermissionsInCategory: (role: RoleData, category: string) => number;
  areAllPermissionsEnabledInCategory: (role: RoleData, category: string) => boolean;
  confirmDeleteRoleId: string | null;
  setConfirmDeleteRoleId: (id: string | null) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  onDeleteRole,
  onEditClick,
  onCopyClick,
  onSaveClick,
  onRolePermissionChange,
  onCategoryPermissionChange,
  countEnabledPermissionsInCategory,
  areAllPermissionsEnabledInCategory,
  confirmDeleteRoleId,
  setConfirmDeleteRoleId
}) => {
  // Format permission name for display
  const formatPermissionName = (permission: string) => {
    return permission
      .split(':')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(': ');
  };

  return (
    <Card className="overflow-hidden border-l-4 transition-all hover:shadow-md" style={{ borderLeftColor: role.isBuiltIn ? 'var(--primary)' : 'var(--muted)' }}>
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
                    onClick={() => onCopyClick(role)}
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
                    onClick={() => onEditClick(role)}
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
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={role.isBuiltIn || (role.userCount !== undefined && role.userCount > 0)}
                    onClick={() => setConfirmDeleteRoleId(role.id)}
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
            
            <Button 
              onClick={() => onSaveClick(role)}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              <span>Sauvegarder</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          <Accordion type="multiple" className="w-full">
            {Object.entries(permissionCategories).map(([category, { description, permissions }]) => {
              const enabledCount = countEnabledPermissionsInCategory(role, category);
              const totalCount = permissions.length;
              const allEnabled = areAllPermissionsEnabledInCategory(role, category);
              
              return (
                <AccordionItem value={`${role.id}-${category}`} key={`${role.id}-${category}`}>
                  <AccordionTrigger className="py-3 hover:bg-muted/30">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-4">
                        <Switch 
                          checked={allEnabled} 
                          onCheckedChange={(checked) => onCategoryPermissionChange(role.id, category, checked)}
                          disabled={role.isBuiltIn}
                          className="data-[state=checked]:bg-primary"
                        />
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{category}</span>
                          <span className="text-xs text-muted-foreground">{description}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-auto mr-4">
                        {enabledCount}/{totalCount}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-muted/20 rounded-md">
                      {permissions.map((permKey) => (
                        <div key={`${role.id}-${permKey}`} className="flex items-center justify-between space-x-4 p-2 rounded-md hover:bg-muted/40">
                          <div className="flex items-center gap-3">
                            <Switch 
                              id={`${role.id}-${permKey}`}
                              checked={role.permissions[permKey as any] || false}
                              onCheckedChange={(checked) => onRolePermissionChange(role.id, permKey, checked)}
                              disabled={role.isBuiltIn}
                              className="data-[state=checked]:bg-primary"
                            />
                            <Label 
                              htmlFor={`${role.id}-${permKey}`}
                              className="cursor-pointer"
                            >
                              {formatPermissionName(permKey)}
                            </Label>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="rounded-full bg-muted w-5 h-5 flex items-center justify-center cursor-help">
                                  <span className="text-xs">?</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{permissionDescriptions[permKey] || `Permission: ${permKey}`}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};
