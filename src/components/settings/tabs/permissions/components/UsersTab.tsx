import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";
import { UserData, RoleData } from "../types";

interface UsersTabProps {
  users: UserData[];
  roles: RoleData[];
  onUserRoleChange: (userId: string, roleId: string) => void;
  onSave: () => Promise<boolean>;
  isSaving: boolean;
}

export function UsersTab({ 
  users, 
  roles, 
  onUserRoleChange, 
  onSave,
  isSaving
}: UsersTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  // Filter users by search query and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRoleFilter = roleFilter === null || 
      user.role.toLowerCase() === roles.find(r => r.id === roleFilter)?.name.toLowerCase();
      
    return matchesSearch && matchesRoleFilter;
  });

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

          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un utilisateur..."
              className="pl-9 w-full mb-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
                      value={roles.find(role => role.name === user.role)?.id || ''}
                      onChange={(e) => onUserRoleChange(user.actualId, e.target.value)}
                    >
                      {roles.map(role => (
                        <option key={`${user.id}-${role.id}`} value={role.id}>{role.name}</option>
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
            <Button onClick={onSave} disabled={isSaving} className="px-8">
              {isSaving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Enregistrer les attributions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
