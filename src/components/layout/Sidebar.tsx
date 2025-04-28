
import {
  BarChart3,
  Building2,
  Calendar,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`flex flex-col ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out border-r bg-sidebar border-r-border`}>
      <div className="h-16 border-b border-b-border flex items-center justify-between px-4">
        {!collapsed && (
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-bold">
              Transport Co.
            </span>
          </div>
        )}
        {collapsed && <Building2 className="h-6 w-6 mx-auto text-primary" />}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-1 rounded-md hover:bg-sidebar-accent"
        >
          <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} py-2 px-3 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground"
                }`
              }
              title="Dashboard"
            >
              <LayoutDashboard className="h-5 w-5" />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} py-2 px-3 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground"
                }`
              }
              title="Bookings"
            >
              <Calendar className="h-5 w-5" />
              {!collapsed && <span>Bookings</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/invoices"
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} py-2 px-3 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground"
                }`
              }
              title="Invoices"
            >
              <FileText className="h-5 w-5" />
              {!collapsed && <span>Invoices</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} py-2 px-3 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground"
                }`
              }
              title="Users"
            >
              <Users className="h-5 w-5" />
              {!collapsed && <span>Users</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} py-2 px-3 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground"
                }`
              }
              title="Reports"
            >
              <BarChart3 className="h-5 w-5" />
              {!collapsed && <span>Reports</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/payments"
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} py-2 px-3 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground"
                }`
              }
              title="Payments"
            >
              <CreditCard className="h-5 w-5" />
              {!collapsed && <span>Payments</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} py-2 px-3 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground"
                }`
              }
              title="Settings"
            >
              <Settings className="h-5 w-5" />
              {!collapsed && <span>Settings</span>}
            </NavLink>
          </li>
        </ul>
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="flex flex-col space-y-1">
            <p className="text-xs font-medium text-sidebar-foreground/70">Transport Co. © 2025</p>
            <p className="text-xs text-sidebar-foreground/50">v1.0.0</p>
          </div>
        )}
      </div>
    </div>
  );
}
