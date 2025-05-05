
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsLayout from "@/components/settings/SettingsLayout";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Settings() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading state or the settings layout
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return <SettingsLayout />;
}
