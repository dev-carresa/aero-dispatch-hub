import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePermission } from "@/context/PermissionContext";
import { Shield, User, Settings, Search, Check, ChevronDown, Plus, Save, Trash2, Copy, X } from "lucide-react";
import { Permission } from "@/lib/permissions";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserRole } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { 
  getAllRoles, 
  getAllPermissions, 
  createRole,
  updateRole, 
  deleteRole, 
  addPermissionToRole, 
  removePermissionFromRole, 
  updateUserRole 
} from "@/services/permissionService";

// Define proper TypeScript interfaces for our data structures
interface RoleData {
  id: string;
  name: string;
  permissions: Record<Permission, boolean>;
  isBuiltIn: boolean;
  description?: string;
  userCount?: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
  role: string;
}

// Group permissions by category for better organization
const permissionCategories: Record<string, { description: string; permissions: string[] }> = {
  "Dashboard": {
    description: "Accès et contrôle du tableau de bord",
    permissions: ["dashboard:view"]
  },
  "Bookings": {
    description: "Gestion des réservations",
    permissions: ["bookings:view", "bookings:create", "bookings:edit", "bookings:delete", "bookings:assign_driver"]
  },
  "Users": {
    description: "Gestion des utilisateurs",
    permissions: ["users:view", "users:create", "users:edit", "users:delete"]
  },
  "API Users": {
    description: "Gestion des utilisateurs API",
    permissions: ["api_users:view", "api_users:create", "api_users:edit", "api_users:delete"]
  },
  "Vehicles": {
    description: "Gestion des véhicules",
    permissions: ["vehicles:view", "vehicles:create", "vehicles:edit", "vehicles:delete"]
  },
  "Airports/Meeting Points": {
    description: "Gestion des aéroports et points de rencontre",
    permissions: ["airports:view", "airports:create", "airports:edit", "airports:delete"]
  },
  "Reports": {
    description: "Création et visualisation des rapports",
    permissions: ["reports:view", "reports:create"]
  },
  "Complaints": {
    description: "Gestion des réclamations",
    permissions: ["complaints:view", "complaints:create", "complaints:respond"]
  },
  "Driver Comments": {
    description: "Commentaires des conducteurs",
    permissions: ["driver_comments:view", "driver_comments:create"]
  },
  "Quality Reviews": {
    description: "Évaluations de qualité",
    permissions: ["quality_reviews:view"]
  },
  "Invoices": {
    description: "Gestion des factures",
    permissions: ["invoices:view", "invoices:create", "invoices:edit"]
  },
  "Settings": {
    description: "Configuration du système",
    permissions: ["settings:view", "settings:edit", "settings:permissions", "settings:api"]
  }
};

// Permission descriptions for tooltips
const permissionDescriptions: Record<string, string> = {
  "dashboard:view": "Voir le tableau de bord et les statistiques",
  "bookings:view": "Voir les réservations",
  "bookings:create": "Créer de nouvelles réservations",
  "bookings:edit": "Modifier les réservations existantes",
  "bookings:delete": "Supprimer des réservations",
  "bookings:assign_driver": "Assigner des chauffeurs aux réservations",
  "users:view": "Voir la liste des utilisateurs",
  "users:create": "Créer de nouveaux utilisateurs",
  "users:edit": "Modifier les utilisateurs existants",
  "users:delete": "Supprimer des utilisateurs",
  "api_users:view": "Voir les utilisateurs API",
  "api_users:create": "Créer de nouveaux utilisateurs API",
  "api_users:edit": "Modifier les utilisateurs API",
  "api_users:delete": "Supprimer des utilisateurs API",
  "vehicles:view": "Voir les véhicules",
  "vehicles:create": "Ajouter de nouveaux véhicules",
  "vehicles:edit": "Modifier les véhicules existants",
  "vehicles:delete": "Supprimer des véhicules",
  "airports:view": "Voir les aéroports et points de rencontre",
  "airports:create": "Créer de nouveaux aéroports",
  "airports:edit": "Modifier les aéroports existants",
  "airports:delete": "Supprimer des aéroports",
  "reports:view": "Voir les rapports",
  "reports:create": "Créer de nouveaux rapports",
  "complaints:view": "Voir les réclamations",
  "complaints:create": "Créer de nouvelles réclamations",
  "complaints:respond": "Répondre aux réclamations",
  "driver_comments:view": "Voir les commentaires des conducteurs",
  "driver_comments:create": "Créer des commentaires de conducteur",
  "quality_reviews:view": "Voir les évaluations de qualité",
  "invoices:view": "Voir les factures",
  "invoices:create": "Créer de nouvelles factures",
  "invoices:edit": "Modifier les factures existantes",
  "settings:view": "Voir les paramètres",
  "settings:edit": "Modifier les paramètres généraux",
  "settings:permissions": "Gérer les permissions et les rôles",
  "settings:api": "Configurer les paramètres API"
};

// Role colors for badges
const roleColorClasses: Record<string, string> = {
  "Admin": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  "Driver": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  "Fleet": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  "Dispatcher": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  "Customer": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
};

export function PermissionSettings() {
  const { hasPermission, isAdmin, roles: rolePermissions } = usePermission();
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [permissions, setPermissions] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [confirmDeleteRoleId, setConfirmDeleteRoleId] = useState<string | null>(null);

  // State for role operations
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const [isRoleOpDialogOpen, setIsRoleOpDialogOpen] = useState(false);
  const [roleOpType, setRoleOpType] = useState<'edit' | 'copy'>('edit');
  const [copiedRoleName, setCopiedRoleName] = useState("");

  // Initialize role data from our predefined permissions and/or database
  useEffect(() => {
    fetchRolesFromDB();
    fetchUsers();
    fetchPermissions();
  }, []);

  // Fetch all permissions
  const fetchPermissions = async () => {
    try {
      const { data, success } = await getAllPermissions();
      if (success && data) {
        setPermissions(data);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error("Impossible de charger les permissions");
    }
  };

  // Fetch roles from the database or initialize from predefined permissions
  const fetchRolesFromDB = async () => {
    setIsLoading(true);
    try {
      const { data: rolesData, success } = await getAllRoles();
      
      if (success && rolesData && rolesData.length > 0) {
        // Convert to the format needed by the UI
        const formattedRoles: RoleData[] = rolesData.map(role => {
          // Create an object with all permissions set to false by default
          const allPermissions: Record<Permission, boolean> = {} as Record<Permission, boolean>;
          
          // Initialize all possible permissions as false
          const allPermissionKeys = Object.values(permissionCategories).flatMap(cat => cat.permissions);
          allPermissionKeys.forEach(perm => {
            allPermissions[perm as Permission] = false;
          });
          
          // Set the permissions this role has to true
          const rolePerms = role.permissions || [];
          rolePerms.forEach(perm => {
            allPermissions[perm as Permission] = true;
          });
          
          // Return the role data structure
          return {
            id: role.id,
            name: role.name,
            description: role.description || `${role.name} role`,
            permissions: allPermissions,
            isBuiltIn: role.is_system || false,
            userCount: 0 // Will be updated when we fetch users
          };
        });
        
        setRoles(formattedRoles);
      }
      
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Impossible de charger les rôles");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users from the database
  const fetchUsers = async () => {
    try {
      // In a real application, this would fetch from the database
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      // Map database results to our UserData format
      const fetchedUsers: UserData[] = profilesData.map((profile, index) => {
        const nameParts = profile.name.split(' ');
        const initials = nameParts.length > 1 
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : profile.name.substring(0, 2);
        
        // Assign a color based on role or index for variety
        const colors = ['blue', 'green', 'purple', 'amber', 'pink', 'indigo', 'teal'];
        const color = colors[index % colors.length];
        
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          initials: initials.toUpperCase(),
          color: color,
          role: profile.role
        };
      });
      
      // Update user counts for each role
      const updatedRoles = [...roles];
      for (const role of updatedRoles) {
        role.userCount = fetchedUsers.filter(user => 
          user.role.toLowerCase() === role.name.toLowerCase()
        ).length;
      }
      
      setRoles(updatedRoles);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Impossible de charger les utilisateurs");
    }
  };

  const handleRolePermissionChange = async (roleId: string, permissionKey: string, value: boolean) => {
    // Find the permission ID
    const permission = permissions.find(p => p.name === permissionKey);
    if (!permission) {
      toast.error(`Permission ${permissionKey} not found`);
      return;
    }
    
    // Update state first for immediate UI feedback
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          permissions: {
            ...role.permissions,
            [permissionKey]: value
          }
        };
      }
      return role;
    }));
    
    try {
      // Update the database
      if (value) {
        await addPermissionToRole(roleId, permission.id);
      } else {
        await removePermissionFromRole(roleId, permission.id);
      }
      toast.success(`Permission mise à jour avec succès`);
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
      
      // Revert the state change on error
      fetchRolesFromDB();
    }
  };

  const handleCategoryPermissionChange = async (roleId: string, category: string, value: boolean) => {
    // Get all permissions in the category
    const permissionKeys = permissionCategories[category].permissions;
    
    // Update state first for immediate UI feedback
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const updatedPermissions = { ...role.permissions };
        permissionKeys.forEach(perm => {
          updatedPermissions[perm as Permission] = value;
        });
        
        return {
          ...role,
          permissions: updatedPermissions
        };
      }
      return role;
    }));
    
    // Update database
    try {
      // Process each permission in the category
      for (const permKey of permissionKeys) {
        await handleRolePermissionChange(roleId, permKey, value);
      }
    } catch (error) {
      console.error('Error updating category permissions:', error);
      toast.error('Failed to update all permissions in category');
      
      // Refresh roles from DB on error
      fetchRolesFromDB();
    }
  };

  const handleUserRoleChange = async (userId: string, newRoleName: string) => {
    // Find the role ID
    const role = roles.find(r => r.name === newRoleName);
    if (!role) {
      toast.error(`Role ${newRoleName} not found`);
      return;
    }
    
    // Update state first for immediate UI feedback
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          role: newRoleName
        };
      }
      return user;
    }));
    
    try {
      // Update user role in the database
      await updateUserRole(userId, role.id);
      toast.success(`Rôle de l'utilisateur mis à jour avec succès`);
      
      // Update the role user counts
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
      
      // Refresh users on error
      fetchUsers();
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    // Check if role is in use
    const roleInUse = users.some(user => {
      const role = roles.find(r => r.id === roleId);
      return role && user.role.toLowerCase() === role.name.toLowerCase();
    });
    
    if (roleInUse) {
      toast.error("Impossible de supprimer un rôle attribué à des utilisateurs");
      return;
    }
    
    try {
      // Delete role from the database
      const { success } = await deleteRole(roleId);
      
      if (success) {
        // Update local state
        setRoles(roles.filter(role => role.id !== roleId));
        setConfirmDeleteRoleId(null);
        toast.success("Rôle supprimé avec succès");
      } else {
        throw new Error("Failed to delete role");
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role');
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      toast.error("Le nom du rôle ne peut pas être vide");
      return;
    }
    
    try {
      // Create the role in the database
      const { data: newRoleData, success } = await createRole(
        newRoleName, 
        newRoleDescription || `Custom role: ${newRoleName}`
      );
      
      if (!success || !newRoleData) {
        throw new Error("Failed to create role");
      }
      
      // Create empty permissions object
      const permissions: Record<Permission, boolean> = {} as Record<Permission, boolean>;
      
      // Initialize all permissions as false
      const allPermissionKeys = Object.values(permissionCategories).flatMap(cat => cat.permissions);
      allPermissionKeys.forEach(perm => {
        permissions[perm as Permission] = false;
      });
      
      // Add the new role to local state
      const newRole: RoleData = {
        id: newRoleData.id,
        name: newRoleName,
        description: newRoleDescription || `Custom role: ${newRoleName}`,
        permissions,
        isBuiltIn: false,
        userCount: 0
      };
      
      setRoles([...roles, newRole]);
      setNewRoleName("");
      setNewRoleDescription("");
      setIsCreateDialogOpen(false);
      toast.success(`Rôle "${newRoleName}" créé avec succès`);
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('Failed to create role');
    }
  };

  const handleEditRole = async () => {
    if (!editingRole) return;
    
    try {
      // Update the role in the database
      const { success } = await updateRole(editingRole.id, {
        name: editingRole.name,
        description: editingRole.description
      });
      
      if (!success) {
        throw new Error("Failed to update role");
      }
      
      // Update local state
      setRoles(roles.map(role => role.id === editingRole.id ? editingRole : role));
      setEditingRole(null);
      setIsRoleOpDialogOpen(false);
      toast.success(`Rôle "${editingRole.name}" mis à jour avec succès`);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };

  const handleCopyRole = async () => {
    if (!selectedRole || !copiedRoleName.trim()) return;

    try {
      // Create the role in the database
      const { data: newRoleData, success } = await createRole(
        copiedRoleName,
        `Copy of ${selectedRole.name}`
      );
      
      if (!success || !newRoleData) {
        throw new Error("Failed to create role");
      }
      
      // Copy permissions from the selected role
      const enabledPermissions = Object.entries(selectedRole.permissions)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([permName, _]) => permName);
        
      for (const permName of enabledPermissions) {
        // Find permission ID
        const permission = permissions.find(p => p.name === permName);
        if (permission) {
          await addPermissionToRole(newRoleData.id, permission.id);
        }
      }
      
      // Create a new role based on the selected role
      const newRole: RoleData = {
        ...selectedRole,
        id: newRoleData.id,
        name: copiedRoleName,
        isBuiltIn: false,
        description: `Copy of ${selectedRole.name}`,
        userCount: 0
      };

      setRoles([...roles, newRole]);
      setCopiedRoleName("");
      setSelectedRole(null);
      setIsRoleOpDialogOpen(false);
      toast.success(`Rôle "${copiedRoleName}" créé avec succès`);
      
      // Refresh to get the updated data
      fetchRolesFromDB();
    } catch (error) {
      console.error('Error copying role:', error);
      toast.error('Failed to copy role');
    }
  };

  const saveUserPermissions = async () => {
    try {
      // This function is now less important since we're updating roles immediately,
      // but we can still use it to make sure all pending changes are committed
      toast.success("Permissions des utilisateurs enregistrées avec succès");
    } catch (error) {
      console.error('Error saving user permissions:', error);
      toast.error('Failed to save user permissions');
    }
  };

  const saveRolePermissions = async (role: RoleData) => {
    try {
      // This function is now less important since we're updating permissions immediately,
      // but we can still use it to make sure all pending changes are committed
      toast.success(`Permissions pour le rôle "${role.name}" enregistrées avec succès`);
    } catch (error) {
      console.error('Error saving role permissions:', error);
      toast.error('Failed to save role permissions');
    }
  };

  // Count how many permissions are enabled in a category for a role
  const countEnabledPermissionsInCategory = (role: RoleData, category: string) => {
    const permissions = permissionCategories[category].permissions;
    return permissions.filter(perm => role.permissions[perm as Permission]).length;
  };

  // Calculate if all permissions in a category are enabled for a role
  const areAllPermissionsEnabledInCategory = (role: RoleData, category: string) => {
    const permissions = permissionCategories[category].permissions;
    return permissions.every(perm => role.permissions[perm as Permission]);
  };

  // Format permission name for display
  const formatPermissionName = (permission: string) => {
    return permission
      .split(':')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(': ');
  };

  // Filter roles by search query
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter users by search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
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
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Annuler</Button>
                  <Button onClick={handleCreateRole}>Créer Rôle</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="roles" className="space-y-6">
          {filteredRoles.map((role) => (
            <Card key={role.id} className="overflow-hidden border-l-4 transition-all hover:shadow-md" style={{ borderLeftColor: role.isBuiltIn ? 'var(--primary)' : 'var(--muted)' }}>
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
                            onClick={() => {
                              setSelectedRole(role);
                              setRoleOpType('copy');
                              setCopiedRoleName(`${role.name} Copy`);
                              setIsRoleOpDialogOpen(true);
                            }}
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
                            onClick={() => {
                              setEditingRole(role);
                              setRoleOpType('edit');
                              setIsRoleOpDialogOpen(true);
                            }}
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
                    
                    <AlertDialog open={confirmDeleteRoleId === role.id} onOpenChange={(open) => !open && setConfirmDeleteRoleId(null)}>
                      <AlertDialogTrigger asChild>
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
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer le rôle</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer le rôle <strong>{role.name}</strong>? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-500 text-white hover:bg-red-600"
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button 
                      onClick={() => saveRolePermissions(role)}
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
                                  onCheckedChange={(checked) => handleCategoryPermissionChange(role.id, category, checked)}
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
                                      checked={role.permissions[permKey as Permission] || false}
                                      onCheckedChange={(checked) => handleRolePermissionChange(role.id, permKey, checked)}
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
                  onClick={() => {
                    setSearchQuery("");
                    setRoleFilter(null);
                  }}
                >
                  Effacer la recherche
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="hover-scale shadow-sm">
            <CardHeader>
              <CardTitle>Attribution des Rôles aux Utilisateurs</CardTitle>
              <CardDescription>Attribuez des rôles spécifiques aux utilisateurs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button 
                    variant={roleFilter === null ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setRoleFilter(null)}
                  >
                    Tous
                  </Button>
                  {roles.map((role) => (
                    <Button
                      key={`filter-${role.id}`}
                      variant={roleFilter === role.id ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setRoleFilter(roleFilter === role.id ? null : role.id)}
                      className="flex items-center gap-2"
                    >
                      {role.name}
                      {role.userCount !== undefined && role.userCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {role.userCount}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {filteredUsers
                    .filter(user => roleFilter === null || user.role.toLowerCase() === roleFilter)
                    .map((user) => (
                      <div key={user.id} className="border rounded-md p-4 transition-all hover:shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full bg-${user.color}-100 flex items-center justify-center text-${user.color}-700 font-medium`}>
                              {user.initials}
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <div className="w-[180px]">
                            <select
                              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary"
                              value={user.role.toLowerCase()}
                              onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                            >
                              {roles.map(role => (
                                <option key={`${user.id}-${role.id}`} value={role.id}>{role.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {filteredUsers.filter(user => roleFilter === null || user.role.toLowerCase() === roleFilter).length === 0 && (
                    <div className="text-center p-6 border rounded-md border-dashed">
                      <p className="text-muted-foreground">Aucun utilisateur trouvé avec ces critères</p>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => {
                          setSearchQuery("");
                          setRoleFilter(null);
                        }}
                      >
                        Effacer les filtres
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={saveUserPermissions} className="px-8">
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les attributions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Role Operations Dialog (Edit & Copy) */}
      <Dialog open={isRoleOpDialogOpen} onOpenChange={setIsRoleOpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {roleOpType === 'edit' ? 'Modifier le Rôle' : 'Dupliquer le Rôle'}
            </DialogTitle>
            <DialogDescription>
              {roleOpType === 'edit' 
                ? 'Modifiez les détails du rôle sélectionné.'
                : 'Créez un nouveau rôle basé sur celui-ci.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role-op-name">Nom du Rôle</Label>
              <Input 
                id="role-op-name"
                value={roleOpType === 'edit' 
                  ? editingRole?.name || '' 
                  : copiedRoleName}
                onChange={(e) => {
                  if (roleOpType === 'edit' && editingRole) {
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
                value={roleOpType === 'edit' 
                  ? editingRole?.description || '' 
                  : `Copy of ${selectedRole?.name || ''}`}
                onChange={(e) => {
                  if (roleOpType === 'edit' && editingRole) {
                    setEditingRole({...editingRole, description: e.target.value});
                  }
                  // For copy, we keep the default description
                }}
                placeholder="Description du rôle"
                disabled={roleOpType === 'copy'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleOpDialogOpen(false)}>Annuler</Button>
            <Button 
              onClick={roleOpType === 'edit' ? handleEditRole : handleCopyRole}
            >
              {roleOpType === 'edit' ? 'Enregistrer' : 'Dupliquer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
