
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
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

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        // Check if database is initialized
        const isInitialized = await checkDatabaseInitialized();
        setInitialized(isInitialized);
      } catch (err) {
        console.error('Failed to check database:', err);
        setInitialized(false);
        setError('Failed to check database initialization status. Assuming database needs initialization.');
      } finally {
        setLoading(false);
      }
    };
    
    // Set a timeout to prevent infinite loading if the check fails
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setInitialized(false);
        setError('Database check timed out. Please initialize the database manually.');
      }
    }, 5000);
    
    checkDatabase();
    
    return () => clearTimeout(timeoutId);
  }, []);

  const initializeDatabase = async () => {
    try {
      setInitializing(true);
      setError(null);

      // Call the edge function to set up the database
      const {
        error: functionError
      } = await supabase.functions.invoke('init-permissions', {
        body: {
          action: 'create_functions'
        }
      });
      
      if (functionError) {
        throw functionError;
      }
      
      toast.success("Database functions created successfully");
      
      const {
        error: seedError
      } = await supabase.functions.invoke('init-permissions', {
        body: {
          action: 'seed_data'
        }
      });
      
      if (seedError) {
        throw seedError;
      }
      
      toast.success("Database seeded successfully");
      setInitialized(true);
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
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
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
        </div>
      </div>
    );
  }

  // If we've checked and the database is initialized, render the children
  return <>{children}</>;
}
