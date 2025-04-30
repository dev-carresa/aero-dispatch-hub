
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { checkDatabaseInitialized } from "@/lib/db/permissionsRpc";

export function InitializeDatabase({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        // Check if database is initialized
        const isInitialized = await checkDatabaseInitialized();
        setInitialized(isInitialized);
      } catch (err) {
        console.error('Failed to check database:', err);
        setInitialized(false);
        setError('Failed to check database initialization status.');
      } finally {
        setLoading(false);
      }
    };

    checkDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the edge function to set up the database
      const { error: functionError } = await supabase.functions.invoke('init-permissions', {
        body: { action: 'create_functions' }
      });

      if (functionError) throw functionError;
      
      const { error: seedError } = await supabase.functions.invoke('init-permissions', {
        body: { action: 'seed_data' }
      });

      if (seedError) throw seedError;
      
      setInitialized(true);
    } catch (err: any) {
      console.error('Error initializing database:', err);
      setError(`Failed to initialize database: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!initialized) {
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
            disabled={loading}
          >
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            Initialize Database
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
