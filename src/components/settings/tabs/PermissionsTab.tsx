
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export const PermissionsTab = () => {
  return (
    <div className="grid gap-6">
      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>Configure user roles and permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Administrator</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm" disabled>Delete</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="admin-all" checked disabled className="h-4 w-4" />
                  <Label htmlFor="admin-all">Full Access</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="admin-manage" checked disabled className="h-4 w-4" />
                  <Label htmlFor="admin-manage">Manage Users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="admin-settings" checked disabled className="h-4 w-4" />
                  <Label htmlFor="admin-settings">Modify Settings</Label>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Manager</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="manager-all" className="h-4 w-4" />
                  <Label htmlFor="manager-all">Full Access</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="manager-manage" checked className="h-4 w-4" />
                  <Label htmlFor="manager-manage">Manage Bookings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="manager-settings" className="h-4 w-4" />
                  <Label htmlFor="manager-settings">Modify Settings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="manager-users" className="h-4 w-4" />
                  <Label htmlFor="manager-users">Manage Users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="manager-reports" checked className="h-4 w-4" />
                  <Label htmlFor="manager-reports">View Reports</Label>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Dispatcher</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="dispatcher-all" className="h-4 w-4" />
                  <Label htmlFor="dispatcher-all">Full Access</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="dispatcher-view" checked className="h-4 w-4" />
                  <Label htmlFor="dispatcher-view">View Bookings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="dispatcher-edit" checked className="h-4 w-4" />
                  <Label htmlFor="dispatcher-edit">Edit Bookings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="dispatcher-assign" checked className="h-4 w-4" />
                  <Label htmlFor="dispatcher-assign">Assign Drivers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="dispatcher-reports" className="h-4 w-4" />
                  <Label htmlFor="dispatcher-reports">View Reports</Label>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Fleet</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="fleet-all" className="h-4 w-4" />
                  <Label htmlFor="fleet-all">Full Access</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="fleet-view" checked className="h-4 w-4" />
                  <Label htmlFor="fleet-view">View Bookings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="fleet-assign" checked className="h-4 w-4" />
                  <Label htmlFor="fleet-assign">Assign Drivers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="fleet-reports" checked className="h-4 w-4" />
                  <Label htmlFor="fleet-reports">View Reports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="fleet-edit" className="h-4 w-4" />
                  <Label htmlFor="fleet-edit">Edit Bookings</Label>
                </div>
              </div>
            </div>
            
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
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                    AD
                  </div>
                  <div>
                    <p className="font-medium">Admin User</p>
                    <p className="text-sm text-muted-foreground">admin@transport-co.com</p>
                  </div>
                </div>
                <select
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                  defaultValue="admin"
                >
                  <option value="admin">Administrator</option>
                  <option value="manager">Manager</option>
                  <option value="dispatcher">Dispatcher</option>
                  <option value="driver">Driver</option>
                  <option value="fleet">Fleet</option>
                </select>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium">
                    JD
                  </div>
                  <div>
                    <p className="font-medium">Jane Doe</p>
                    <p className="text-sm text-muted-foreground">jane@transport-co.com</p>
                  </div>
                </div>
                <select
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                  defaultValue="manager"
                >
                  <option value="admin">Administrator</option>
                  <option value="manager">Manager</option>
                  <option value="dispatcher">Dispatcher</option>
                  <option value="driver">Driver</option>
                  <option value="fleet">Fleet</option>
                </select>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
                    MS
                  </div>
                  <div>
                    <p className="font-medium">Mike Smith</p>
                    <p className="text-sm text-muted-foreground">mike@transport-co.com</p>
                  </div>
                </div>
                <select
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                  defaultValue="dispatcher"
                >
                  <option value="admin">Administrator</option>
                  <option value="manager">Manager</option>
                  <option value="dispatcher">Dispatcher</option>
                  <option value="driver">Driver</option>
                  <option value="fleet">Fleet</option>
                </select>
              </div>
            </div>
            
            <Button className="w-full">Save User Permissions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
