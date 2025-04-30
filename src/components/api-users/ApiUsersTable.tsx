
import { useState } from "react";
import { 
  Table, 
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ApiUser } from "@/types/apiUser";
import { ApiKeyDisplay } from "./ApiKeyDisplay";
import { formatDistanceToNow } from "date-fns";

interface ApiUsersTableProps {
  apiUsers: ApiUser[];
  onView: (apiUser: ApiUser) => void;
  onEdit: (apiUser: ApiUser) => void;
  onDelete: (apiUser: ApiUser) => void;
  onToggleStatus?: (apiUser: ApiUser) => void;
}

export function ApiUsersTable({ 
  apiUsers, 
  onView, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: ApiUsersTableProps) {
  const [expandedApiKey, setExpandedApiKey] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    if (expandedApiKey === id) {
      setExpandedApiKey(null);
    } else {
      setExpandedApiKey(id);
    }
  };

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case "api_access": return "API Access";
      case "white_label": return "White Label";
      case "both": return "API & White Label";
      default: return type;
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">User</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>API Key</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Used</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No API users found
              </TableCell>
            </TableRow>
          ) : (
            apiUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>{user.company || "-"}</TableCell>
                <TableCell>
                  <Badge variant="outline">{getServiceTypeLabel(user.serviceType)}</Badge>
                </TableCell>
                <TableCell>
                  <div>
                    {expandedApiKey === user.id ? (
                      <ApiKeyDisplay apiKey={user.apiKey} label="API Key" />
                    ) : (
                      <button 
                        onClick={() => toggleExpand(user.id)} 
                        className="text-sm text-primary hover:underline"
                      >
                        Click to reveal
                      </button>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === "active" ? "default" : "secondary"}
                    className={`${user.status === "active" 
                      ? "bg-green-100 text-green-800 hover:bg-green-200" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"} cursor-pointer`}
                    onClick={() => onToggleStatus && onToggleStatus(user)}
                  >
                    {user.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  {user.lastUsed ? (
                    <span title={new Date(user.lastUsed).toLocaleString()}>
                      {formatDistanceToNow(new Date(user.lastUsed), { addSuffix: true })}
                    </span>
                  ) : (
                    "Never"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onView(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(user)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
