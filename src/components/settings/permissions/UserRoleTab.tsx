
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";
import { RoleData, UserData } from "@/types/permission";

interface UserRoleTabProps {
  users: UserData[];
  roles: RoleData[];
  roleFilter: string | null;
  setRoleFilter: (role: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onUserRoleChange: (userId: string, roleName: string) => void;
  onSavePermissions: () => void;
}

export const UserRoleTab: React.FC<UserRoleTabProps> = ({
  users,
  roles,
  roleFilter,
  setRoleFilter,
  searchQuery,
  setSearchQuery,
  onUserRoleChange,
  onSavePermissions
}) => {
  // Filter users by search query and role filter
  const filteredUsers = users.filter(user => 
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.role.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (roleFilter === null || user.role === roleFilter)
  );

  return (
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
                variant={roleFilter === role.name ? "secondary" : "outline"}
                size="sm"
                onClick={() => setRoleFilter(roleFilter === role.name ? null : role.name)}
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
            {filteredUsers.map((user) => (
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
                      value={user.role}
                      onChange={(e) => onUserRoleChange(user.id, e.target.value)}
                    >
                      {roles.map(role => (
                        <option key={`${user.id}-${role.id}`} value={role.name}>{role.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredUsers.length === 0 && (
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
            <Button onClick={onSavePermissions} className="px-8">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer les attributions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
