
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RoleData, permissionDescriptions } from "../types";
import { countEnabledPermissionsInCategory, areAllPermissionsEnabledInCategory, formatPermissionName } from "../utils";
import { permissionCategories } from "../types";

interface PermissionCategoryProps {
  role: RoleData;
  category: string;
  onCategoryToggle: (roleId: string, category: string, value: boolean) => void;
  onPermissionToggle: (roleId: string, permissionKey: string, value: boolean) => void;
}

export function PermissionCategory({ 
  role,
  category,
  onCategoryToggle,
  onPermissionToggle
}: PermissionCategoryProps) {
  const { description, permissions } = permissionCategories[category];
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
              onCheckedChange={(checked) => onCategoryToggle(role.id, category, checked)}
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
                  checked={role.permissions[permKey] || false}
                  onCheckedChange={(checked) => onPermissionToggle(role.id, permKey, checked)}
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
}
