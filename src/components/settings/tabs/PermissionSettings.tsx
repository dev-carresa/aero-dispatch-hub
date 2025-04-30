
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function PermissionSettings() {
  const [roles, setRoles] = useState([
    {
      id: "admin",
      name: "Administrator",
      permissions: {
        fullAccess: true,
        manageUsers: true,
        modifySettings: true
      },
      isBuiltIn: true
    },
    {
      id: "manager",
      name: "Manager",
      permissions: {
        fullAccess: false,
        manageBookings: true,
        modifySettings: false,
        manageUsers: false,
        viewReports: true
      },
      isBuiltIn: false
    },
    {
      id: "dispatcher",
      name: "Dispatcher",
      permissions: {
        fullAccess: false,
        viewBookings: true,
        editBookings: true,
        assignDrivers: true,
        viewReports: false
      },
      isBuiltIn: false
    },
    {
      id: "fleet",
      name: "Fleet",
      permissions: {
        fullAccess: false,
        viewBookings: true,
        assignDrivers: true,
        viewReports: true,
        editBookings: false
      },
      isBuiltIn: false
    }
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin User",
      email: "admin@transport-co.com",
      initials: "AD",
      color: "blue",
      role: "admin"
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane@transport-co.com",
      initials: "JD",
      color: "green",
      role: "manager"
    },
    {
      id: 3,
      name: "Mike Smith",
      email: "mike@transport-co.com",
      initials: "MS",
      color: "purple",
      role: "dispatcher"
    }
  ]);

  const handleRolePermissionChange = (roleId: string, permissionKey: string, value: boolean) => {
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
  };

  const handleUserRoleChange = (userId: number, newRole: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          role: newRole
        };
      }
      return user;
    }));
  };

  const deleteRole = (roleId: string) => {
    // Check if role is in use
    const roleInUse = users.some(user => user.role === roleId);
    
    if (roleInUse) {
      toast.error("Cannot delete role that is assigned to users");
      return;
    }
    
    setRoles(roles.filter(role => role.id !== roleId));
    toast.success("Role deleted successfully");
  };

  const saveUserPermissions = () => {
    toast.success("User permissions saved successfully");
  };

  return (
    <div className="grid gap-6">
      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>Configure user roles and permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {roles.map((role) => (
              <div key={role.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{role.name}</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      disabled={role.isBuiltIn}
                      onClick={() => deleteRole(role.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(role.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id={`${role.id}-${key}`}
                        checked={value}
                        disabled={role.isBuiltIn}
                        onChange={(e) => handleRolePermissionChange(role.id, key, e.target.checked)}
                        className="h-4 w-4" 
                      />
                      <Label htmlFor={`${role.id}-${key}`}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <Button>Create New Role</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>User Permissions</CardTitle>
          <CardDescription>Assign roles to specific users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border rounded-md p-4">
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
                  <select
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={user.role}
                    onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            
            <Button className="w-full" onClick={saveUserPermissions}>Save User Permissions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
