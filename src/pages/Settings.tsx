
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsLayout from "@/components/settings/SettingsLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";

export default function Settings() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else {
        setIsPageLoading(false);
      }
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading state while checking authentication
  if (loading || isPageLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return <SettingsLayout />;
}
