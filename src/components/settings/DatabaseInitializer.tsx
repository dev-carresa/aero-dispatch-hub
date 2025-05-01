
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DatabaseInitializer() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const checkStatus = async () => {
    try {
      setStatus("Checking database status...");
      
      // Check roles table directly
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('id, name')
        .limit(10);
        
      if (rolesError) {
        setStatus(`Error checking roles: ${rolesError.message}`);
        return;
      }
      
      if (rolesData && rolesData.length > 0) {
        setStatus(`Database is initialized with ${rolesData.length} roles: ${rolesData.map(r => r.name).join(', ')}`);
      } else {
        setStatus("No roles found in database. Database needs initialization.");
      }
    } catch (error) {
      console.error('Error checking status:', error);
      setStatus(`Error checking status: ${error.message}`);
    }
  };

  const initializeDatabase = async () => {
    try {
      setIsLoading(true);
      setStatus("Creating database functions...");
      
      // Call the edge function to set up the database
      const { error: functionError } = await supabase.functions.invoke('init-permissions', {
        body: { action: 'create_functions' }
      });

      if (functionError) {
        setStatus(`Error creating functions: ${functionError.message}`);
        throw functionError;
      }
      
      setStatus("Database functions created successfully. Seeding data...");
      toast.success("Database functions created successfully");
      
      const { error: seedError } = await supabase.functions.invoke('init-permissions', {
        body: { action: 'seed_data' }
      });
      
      if (seedError) {
        setStatus(`Error seeding data: ${seedError.message}`);
        throw seedError;
      }
      
      setStatus("Database initialized successfully!");
      toast.success("Database seeded successfully");
      
      // Check the final status
      await checkStatus();
    } catch (error) {
      console.error('Error initializing database:', error);
      setStatus(`Failed to initialize database: ${error.message || 'Unknown error'}`);
      toast.error(`Failed to initialize database: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Initialize Role & Permission System</CardTitle>
        <CardDescription>
          Set up the database to support role-based permissions. This only needs to be done once.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This will create necessary database functions and seed initial role and permission data.
          Use this if you're seeing permission-related errors or after database schema changes.
        </p>
        
        {status && (
          <Alert className="mb-4">
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={checkStatus} 
          variant="outline" 
          className="w-full mb-2"
        >
          Check Current Status
        </Button>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={initializeDatabase} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Initializing..." : "Initialize Database"}
        </Button>
      </CardFooter>
    </Card>
  );
}
