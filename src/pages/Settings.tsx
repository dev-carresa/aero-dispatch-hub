import { ArrowLeft, Bell, Clock, Globe, Lock, Palette, Server, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Settings = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage application settings and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 md:grid-cols-8 lg:w-fit mb-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span className="hidden md:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden md:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="timezone" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden md:inline">Timezone</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden md:inline">Permissions</span>
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover-scale shadow-sm card-gradient">
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your company details shown on invoices and communications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" placeholder="Transport Co." defaultValue="Transport Co." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Address</Label>
                  <Textarea id="companyAddress" placeholder="Company address" defaultValue="123 Transport St, New York, NY 10001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                  <Input id="taxId" placeholder="Tax ID or VAT number" defaultValue="US123456789" />
                </div>
                <Button className="w-full">Save Company Information</Button>
              </CardContent>
            </Card>

            <Card className="hover-scale shadow-sm card-gradient">
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>Configure general application behavior.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoAssign">Auto-assign Drivers</Label>
                    <p className="text-sm text-muted-foreground">Automatically assign drivers to new bookings.</p>
                  </div>
                  <Switch id="autoAssign" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoCancel">Auto-cancel Pending</Label>
                    <p className="text-sm text-muted-foreground">Automatically cancel bookings without payment after 24h.</p>
                  </div>
                  <Switch id="autoCancel" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sendReminders">Send Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send email reminders before pickup time.</p>
                  </div>
                  <Switch id="sendReminders" />
                </div>
                <Button className="w-full">Save Application Settings</Button>
              </CardContent>
            </Card>

            <Card className="hover-scale shadow-sm card-gradient md:col-span-2">
              <CardHeader>
                <CardTitle>Currency & Pricing</CardTitle>
                <CardDescription>Configure currency and price calculation settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultCurrency">Default Currency</Label>
                    <Input id="defaultCurrency" placeholder="USD" defaultValue="USD" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priceRounding">Price Rounding</Label>
                    <Input id="priceRounding" placeholder="0.99" defaultValue="0.99" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                    <Input id="taxRate" placeholder="20" defaultValue="20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cancelFee">Cancellation Fee (%)</Label>
                    <Input id="cancelFee" placeholder="25" defaultValue="25" />
                  </div>
                </div>
                <Button className="w-full mt-4">Save Currency & Pricing</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover-scale shadow-sm card-gradient">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+1 (555) 000-0000" />
                </div>
                <Button className="w-full">Update Profile</Button>
              </CardContent>
            </Card>
            
            <Card className="hover-scale shadow-sm card-gradient">
              <CardHeader>
                <CardTitle>Avatar & Preferences</CardTitle>
                <CardDescription>Update your profile picture and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-primary">AD</span>
                  </div>
                  <Button variant="outline" size="sm">Upload Photo</Button>
                </div>
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="newsletter">Receive Newsletter</Label>
                    <Switch id="newsletter" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="marketing">Marketing Communications</Label>
                    <Switch id="marketing" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="hover-scale shadow-sm card-gradient">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailBookings">New Bookings</Label>
                    <Switch id="emailBookings" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailCancellations">Cancellations</Label>
                    <Switch id="emailCancellations" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailPayments">Payments</Label>
                    <Switch id="emailPayments" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailReviews">Customer Reviews</Label>
                    <Switch id="emailReviews" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pushBookings">New Bookings</Label>
                    <Switch id="pushBookings" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pushCancellations">Cancellations</Label>
                    <Switch id="pushCancellations" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pushPayments">Payments</Label>
                    <Switch id="pushPayments" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pushReviews">Customer Reviews</Label>
                    <Switch id="pushReviews" />
                  </div>
                </div>
              </div>
              <Button className="w-full">Save Notification Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card className="hover-scale shadow-sm card-gradient">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Update your password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button className="w-full">Update Password</Button>
              </CardContent>
            </Card>

            <Card className="hover-scale shadow-sm card-gradient">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure your account security options.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                  <Switch id="twoFactor" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sessionTimeout">Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Automatically log out after 2 hours of inactivity.</p>
                  </div>
                  <Switch id="sessionTimeout" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ipRestriction">IP Restriction</Label>
                    <p className="text-sm text-muted-foreground">Restrict login to specific IP addresses.</p>
                  </div>
                  <Switch id="ipRestriction" />
                </div>
                <Button className="w-full">Save Security Settings</Button>
              </CardContent>
            </Card>

            <Card className="hover-scale shadow-sm card-gradient md:col-span-2">
              <CardHeader>
                <CardTitle>Login Sessions</CardTitle>
                <CardDescription>Manage your active login sessions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Chrome on Windows</p>
                        <p className="text-sm text-muted-foreground">Last active: 2 minutes ago</p>
                        <p className="text-xs text-muted-foreground mt-1">IP: 192.168.1.1</p>
                      </div>
                      <Button variant="outline" size="sm">Current Session</Button>
                    </div>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Safari on MacOS</p>
                        <p className="text-sm text-muted-foreground">Last active: 2 days ago</p>
                        <p className="text-xs text-muted-foreground mt-1">IP: 192.168.1.2</p>
                      </div>
                      <Button variant="destructive" size="sm">Terminate</Button>
                    </div>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mobile App on iPhone</p>
                        <p className="text-sm text-muted-foreground">Last active: 5 days ago</p>
                        <p className="text-xs text-muted-foreground mt-1">IP: 192.168.1.3</p>
                      </div>
                      <Button variant="destructive" size="sm">Terminate</Button>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">Terminate All Other Sessions</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api">
          <div className="grid gap-6">
            <Card className="hover-scale shadow-sm card-gradient">
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API keys for development integrations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Production Key</p>
                      <p className="text-sm text-muted-foreground">Created: Apr 15, 2025</p>
                      <div className="mt-2 flex items-center">
                        <Input 
                          className="font-mono text-sm" 
                          value="sk_live_xxxxxxxxxxxxxxxxxxxx" 
                          readOnly 
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">Copy</Button>
                      <Button variant="destructive" size="sm">Revoke</Button>
                    </div>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Development Key</p>
                      <p className="text-sm text-muted-foreground">Created: Apr 10, 2025</p>
                      <div className="mt-2 flex items-center">
                        <Input 
                          className="font-mono text-sm" 
                          value="sk_test_xxxxxxxxxxxxxxxxxxxx" 
                          readOnly 
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">Copy</Button>
                      <Button variant="destructive" size="sm">Revoke</Button>
                    </div>
                  </div>
                </div>
                <Button>Generate New API Key</Button>
              </CardContent>
            </Card>

            <Card className="hover-scale shadow-sm card-gradient">
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
                <CardDescription>Monitor your API usage and rate limits.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Daily Requests (2,430 / 10,000)</Label>
                      <span className="text-xs text-muted-foreground">24.3%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '24.3%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Monthly Bandwidth (156MB / 1GB)</Label>
                      <span className="text-xs text-muted-foreground">15.6%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '15.6%' }}></div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-medium mb-2">Recent API Requests</h4>
                    <div className="text-sm border rounded-md divide-y">
                      <div className="p-3 flex justify-between">
                        <span>GET /api/bookings</span>
                        <span className="text-muted-foreground">2 min ago</span>
                      </div>
                      <div className="p-3 flex justify-between">
                        <span>POST /api/bookings/create</span>
                        <span className="text-muted-foreground">5 min ago</span>
                      </div>
                      <div className="p-3 flex justify-between">
                        <span>GET /api/vehicles</span>
                        <span className="text-muted-foreground">10 min ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover-scale shadow-sm card-gradient">
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>Customize the appearance of your dashboard.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Color Mode</Label>
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="light-mode" 
                          name="color-mode" 
                          className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                          defaultChecked
                        />
                        <Label htmlFor="light-mode">Light</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="dark-mode" 
                          name="color-mode" 
                          className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" 
                        />
                        <Label htmlFor="dark-mode">Dark</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="system-mode" 
                          name="color-mode" 
                          className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" 
                        />
                        <Label htmlFor="system-mode">System</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="grid grid-cols-6 gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-600 cursor-pointer ring-2 ring-offset-2 ring-blue-600"></div>
                      <div className="h-8 w-8 rounded-full bg-purple-600 cursor-pointer"></div>
                      <div className="h-8 w-8 rounded-full bg-pink-600 cursor-pointer"></div>
                      <div className="h-8 w-8 rounded-full bg-orange-600 cursor-pointer"></div>
                      <div className="h-8 w-8 rounded-full bg-green-600 cursor-pointer"></div>
                      <div className="h-8 w-8 rounded-full bg-gray-600 cursor-pointer"></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="font-small" 
                          name="font-size" 
                          className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" 
                        />
                        <Label htmlFor="font-small" className="text-sm">Small</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="font-medium" 
                          name="font-size" 
                          className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                          defaultChecked
                        />
                        <Label htmlFor="font-medium">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="font-large" 
                          name="font-size" 
                          className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" 
                        />
                        <Label htmlFor="font-large" className="text-lg">Large</Label>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">Save Appearance Settings</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-scale shadow-sm card-gradient">
              <CardHeader>
                <CardTitle>Layout Options</CardTitle>
                <CardDescription>Customize the layout of your dashboard.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="fixedHeader">Fixed Header</Label>
                    <p className="text-sm text-muted-foreground">Keep the header visible while scrolling.</p>
                  </div>
                  <Switch id="fixedHeader" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compactSidebar">Compact Sidebar</Label>
                    <p className="text-sm text-muted-foreground">Use icons-only sidebar by default.</p>
                  </div>
                  <Switch id="compactSidebar" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="animations">Interface Animations</Label>
                    <p className="text-sm text-muted-foreground">Enable animations throughout the interface.</p>
                  </div>
                  <Switch id="animations" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="cardShadows">Card Shadows</Label>
                    <p className="text-sm text-muted-foreground">Enable shadows on cards for more depth.</p>
                  </div>
                  <Switch id="cardShadows" defaultChecked />
                </div>
                <Button className="w-full">Save Layout Options</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timezone Tab */}
        <TabsContent value="timezone">
          <Card className="hover-scale shadow-sm card-gradient">
            <CardHeader>
              <CardTitle>Date & Time Settings</CardTitle>
              <CardDescription>Configure timezone and date format preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select 
                  id="timezone"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York">Eastern Time - US & Canada (UTC-05:00)</option>
                  <option value="America/Chicago">Central Time - US & Canada (UTC-06:00)</option>
                  <option value="America/Denver">Mountain Time - US & Canada (UTC-07:00)</option>
                  <option value="America/Los_Angeles">Pacific Time - US & Canada (UTC-08:00)</option>
                  <option value="Europe/London">London, Edinburgh (UTC+00:00)</option>
                  <option value="Europe/Paris">Paris, Berlin, Rome (UTC+01:00)</option>
                  <option value="Asia/Tokyo">Tokyo, Osaka (UTC+09:00)</option>
                  <option value="Australia/Sydney">Sydney, Melbourne (UTC+10:00)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <select 
                  id="dateFormat"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY (04/28/2025)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (28/04/2025)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (2025-04-28)</option>
                  <option value="MMM D, YYYY">MMM D, YYYY (Apr 28, 2025)</option>
                  <option value="D MMM YYYY">D MMM YYYY (28 Apr 2025)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeFormat">Time Format</Label>
                <select 
                  id="timeFormat"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="12">12-hour (2:30 PM)</option>
                  <option value="24">24-hour (14:30)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label htmlFor="autoDetect">Auto-detect Timezone</Label>
                  <p className="text-sm text-muted-foreground">Automatically detect and set timezone based on browser.</p>
                </div>
                <Switch id="autoDetect" />
              </div>
              
              <Button className="w-full">Save Date & Time Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
