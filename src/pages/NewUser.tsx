
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UserForm } from "@/components/users/form/UserForm";
import { UserFormInfo } from "@/components/users/form/UserFormInfo";

const NewUser = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "Driver";
  const [selectedRole, setSelectedRole] = useState(initialRole);

  // This function will be called by the UserForm component when the role changes
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
        <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border">
          <UserForm 
            initialRole={initialRole}
          />
        </div>
        
        <UserFormInfo isDriverForm={isDriverForm} />
      </div>
    </div>
  );
};

export default NewUser;
