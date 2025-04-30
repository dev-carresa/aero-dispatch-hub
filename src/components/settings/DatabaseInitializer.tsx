
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function DatabaseInitializer() {
  const [isLoading, setIsLoading] = useState(false);

  const initializeDatabase = async () => {
    try {
      setIsLoading(true);
      
      // Call the edge function to set up the database
      const { error: functionError } = await supabase.functions.invoke('init-permissions', {
        body: { action: 'create_functions' }
      });

      if (functionError) throw functionError;
      
      const { error: seedError } = await supabase.functions.invoke('init-permissions', {
        body: { action: 'seed_data' }
      });

      if (seedError) throw seedError;
      
      toast.success("Database initialized successfully! Please refresh the page.");
    } catch (error) {
      console.error('Error initializing database:', error);
      toast.error("Error initializing database. See console for details.");
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
        <p className="text-sm text-muted-foreground">
          This will create necessary database functions and seed initial role and permission data.
          Use this if you're seeing permission-related errors or after database schema changes.
        </p>
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
