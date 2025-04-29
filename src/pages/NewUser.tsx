
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserForm } from "@/components/users/new-user/UserForm";
import { UserFormSidebar } from "@/components/users/new-user/UserFormSidebar";
import { useState } from "react";

const NewUser = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "Driver";
  const [selectedRole, setSelectedRole] = useState(initialRole);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  const isDriverForm = selectedRole === "Driver";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button onClick={() => navigate("/users")} variant="outline" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          Create New {isDriverForm ? "Driver" : "User"}
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <UserForm 
          initialRole={initialRole} 
          onRoleChange={handleRoleChange}
        />
        <UserFormSidebar isDriverForm={isDriverForm} />
      </div>
    </div>
  );
};

export default NewUser;
