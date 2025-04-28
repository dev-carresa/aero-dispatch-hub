import {
  BarChart3,
  Building2,
  Calendar,
  FileText,  // Changed from FileInvoice to FileText
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 border-r bg-sidebar border-r-border">
      <div className="h-16 border-b border-b-border flex items-center justify-center">
        <Building2 className="h-8 w-8 text-primary" />
        <span className="ml-2 text-lg font-bold">
          Transportation Co.
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                `flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                }`
              }
            >
              <Calendar className="h-4 w-4" />
              <span>Bookings</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/invoices"
              className={({ isActive }) =>
                `flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                }`
              }
            >
              <FileText className="h-4 w-4" />
              <span>Invoices</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                }`
              }
            >
              <Users className="h-4 w-4" />
              <span>Users</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                }`
              }
            >
              <BarChart3 className="h-4 w-4" />
              <span>Reports</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                }`
              }
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
