
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { checkDatabaseInitialized } from "@/lib/db/permissionsRpc";
import { toast } from "sonner";

export function InitializeDatabase({
  children
}: {
  children: React.ReactNode;
}) {
  const [initialized, setInitialized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(false);
  const [statusDetails, setStatusDetails] = useState<any>(null);
  const [bypassAttempts, setBypassAttempts] = useState(0);
  
  // Check if localStorage has a bypass flag (for development purposes)
  useEffect(() => {
    // Always bypass initialization check in development mode or if user has explicitly set the flag
    const shouldBypass = window.location.hostname === 'localhost' || 
                         localStorage.getItem('db_initialized_bypass') === 'true' ||
                         localStorage.getItem('db_initialized') === 'true';
    
    if (shouldBypass) {
      console.log("Database initialization check bypassed");
      setInitialized(true);
      setLoading(false);
      return;
    }
    
    // If not bypassed, proceed with the normal initialization check
    checkDatabase();
  }, []);
  
  // Function to manually bypass initialization check
  const bypassCheck = () => {
    localStorage.setItem('db_initialized', 'true');
    localStorage.setItem('db_initialized_bypass', 'true');
    setInitialized(true);
    toast.success("Bypassed initialization check");
  };

  const checkDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Starting database initialization check...");
      
      // Check if we've already confirmed initialization in localStorage
      if (localStorage.getItem('db_initialized') === 'true') {
        console.log("Using cached initialization status: true");
        setInitialized(true);
        setLoading(false);
        return;
      }
      
      // Try using the checkDatabaseInitialized function
      const isInitialized = await checkDatabaseInitialized();
      console.log("Database check result:", isInitialized);
      
      setInitialized(isInitialized);
      
      if (!isInitialized) {
        // Last resort: direct table check
        try {
          const { data: rolesData } = await supabase
            .from('roles')
            .select('id, name')
            .limit(1);
            
          const { data: permissionsData } = await supabase
            .from('permissions')
            .select('id')
            .limit(1);
          
          if (rolesData && rolesData.length > 0 && permissionsData && permissionsData.length > 0) {
            console.log("Tables exist but initialization status check failed. Assuming initialized.");
            localStorage.setItem('db_initialized', 'true');
            setInitialized(true);
          }
        } catch (directCheckError) {
          console.error("Error in direct table check:", directCheckError);
        }
      }
    } catch (err) {
      console.error('Failed to check database:', err);
      setError('Failed to check database initialization status. Please bypass the check to continue.');
    } finally {
      setLoading(false);
    }
  };
  
  // Set a timeout to auto-show the bypass button if check takes too long
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('Database check timed out. Please bypass the check to continue.');
      }
    }, 5000); // Reduced timeout to 5 seconds for better UX
    
    return () => clearTimeout(timeoutId);
  }, [loading]);

  const initializeDatabase = async () => {
    try {
      setInitializing(true);
      setError(null);
      
      // First step: create the database functions
      console.log("Creating database functions...");
      const {
        error: functionError
      } = await supabase.functions.invoke('init-permissions', {
        body: {
          action: 'create_functions'
        }
      });
      
      if (functionError) {
        console.error("Error creating functions:", functionError);
        throw functionError;
      }
      
      toast.success("Database functions created successfully");
      
      // Second step: seed the data
      console.log("Seeding database data...");
      const {
        error: seedError
      } = await supabase.functions.invoke('init-permissions', {
        body: {
          action: 'seed_data'
        }
      });
      
      if (seedError) {
        console.error("Error seeding data:", seedError);
        throw seedError;
      }
      
      toast.success("Database seeded successfully");
      
      // Final check to confirm initialization
      const { data } = await supabase.functions.invoke('init-permissions', {
        body: { action: 'check_initialization' }
      });
      
      console.log("Final initialization check:", data);
      
      localStorage.setItem('db_initialized', 'true');
      setInitialized(true);
      setStatusDetails(data?.details || data?.tables);
    } catch (err: any) {
      console.error('Error initializing database:', err);
      setError(`Failed to initialize database: ${err.message || 'Unknown error'}`);
      toast.error(`Failed to initialize database: ${err.message || 'Unknown error'}`);
    } finally {
      setInitializing(false);
    }
  };

  // If still doing the initial check, show a loading spinner
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-muted-foreground">Checking database status...</p>
          <Button
            onClick={bypassCheck}
            variant="ghost"
            className="mt-4"
          >
            Skip this check
          </Button>
        </div>
      </div>
    );
  }

  // If we've checked and the database is not initialized, show the initialization UI
  if (initialized === false) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Initialization Required</AlertTitle>
            <AlertDescription>
              The role and permission system needs to be set up before you can use the application.
            </AlertDescription>
          </Alert>
          
          {statusDetails && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Database Status</AlertTitle>
              <AlertDescription>
                <pre className="text-xs overflow-auto max-h-32">
                  {JSON.stringify(statusDetails, null, 2)}
                </pre>
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <Button 
              onClick={initializeDatabase} 
              className="w-full" 
              disabled={initializing}
            >
              {initializing ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Initializing Database...
                </>
              ) : (
                "Initialize Database"
              )}
            </Button>
            
            <Button 
              onClick={bypassCheck} 
              variant="outline" 
              className="w-full"
            >
              Bypass Check and Continue
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            If initialization fails, you can bypass it to access the application.
          </p>
        </div>
      </div>
    );
  }

  // If we've checked and the database is initialized, render the children
  return <>{children}</>;
}
