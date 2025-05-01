
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export function DatabaseInitializer() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [statusDetails, setStatusDetails] = useState<any>(null);

  const checkStatus = async () => {
    try {
      setStatus("Checking database status...");
      setStatusDetails(null);
      
      // First try the dedicated initialization check endpoint
      try {
        const { data, error } = await supabase.functions.invoke('init-permissions', {
          body: { action: 'check_initialization' }
        });
        
        if (error) {
          console.error('Error checking initialization:', error);
          setStatus(`Edge function error: ${error.message}`);
        } else if (data) {
          console.log('Initialization check data:', data);
          setStatusDetails(data.details || data.tables || data);
          
          if (data.initialized) {
            setStatus(`Database is properly initialized.`);
            localStorage.setItem('db_initialized', 'true');
          } else {
            setStatus(`Database initialization incomplete. See details for more info.`);
          }
          return;
        }
      } catch (err) {
        console.error('Error calling init-permissions check:', err);
        // Fall through to next check method
      }
      
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
        setStatusDetails({ roles: rolesData });
        setStatus(`Database has ${rolesData.length} roles: ${rolesData.map(r => r.name).join(', ')}`);
        localStorage.setItem('db_initialized', 'true');
      } else {
        setStatus("No roles found in database. Database needs initialization.");
      }
    } catch (error: any) {
      console.error('Error checking status:', error);
      setStatus(`Error checking status: ${error.message}`);
    }
  };

  const initializeDatabase = async () => {
    try {
      setIsLoading(true);
      setStatus("Creating database functions...");
      setStatusDetails(null);
      
      // Call the edge function to set up the database
      const { data: funcData, error: functionError } = await supabase.functions.invoke('init-permissions', {
        body: { action: 'create_functions' }
      });

      if (functionError) {
        setStatus(`Error creating functions: ${functionError.message}`);
        throw functionError;
      }
      
      setStatus("Database functions created successfully. Seeding data...");
      toast.success("Database functions created successfully");
      
      const { data: seedData, error: seedError } = await supabase.functions.invoke('init-permissions', {
        body: { action: 'seed_data' }
      });
      
      if (seedError) {
        setStatus(`Error seeding data: ${seedError.message}`);
        throw seedError;
      }
      
      // Final check
      const { data: checkData } = await supabase.functions.invoke('init-permissions', {
        body: { action: 'check_initialization' }
      });
      
      if (checkData) {
        setStatusDetails(checkData.details || checkData.tables || checkData);
      }
      
      setStatus("Database initialized successfully!");
      localStorage.setItem('db_initialized', 'true');
      toast.success("Database seeded successfully");
      
    } catch (error: any) {
      console.error('Error initializing database:', error);
      setStatus(`Failed to initialize database: ${error.message || 'Unknown error'}`);
      toast.error(`Failed to initialize database: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const forceBypass = () => {
    localStorage.setItem('db_initialized', 'true');
    setStatus("Force bypass activated. The application will now consider the database as initialized.");
    toast.success("Database initialization check bypassed");
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
          <Alert className="mb-4" variant={status.includes("Error") ? "destructive" : "default"}>
            {status.includes("Error") ? (
              <AlertCircle className="h-4 w-4" />
            ) : status.includes("success") ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Info className="h-4 w-4" />
            )}
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}
        
        {statusDetails && (
          <Alert className="mb-4">
            <AlertTitle>Database Status Details</AlertTitle>
            <AlertDescription>
              <pre className="text-xs mt-2 overflow-auto max-h-32 p-2 bg-secondary/50 rounded">
                {JSON.stringify(statusDetails, null, 2)}
              </pre>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Button 
            onClick={checkStatus} 
            variant="outline" 
            className="w-full mb-2"
          >
            Check Current Status
          </Button>
          
          <Button
            onClick={forceBypass}
            variant="outline"
            className="w-full"
          >
            Force Bypass Initialization Check
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={initializeDatabase} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Initializing...
            </>
          ) : "Initialize Database"}
        </Button>
      </CardFooter>
    </Card>
  );
}
