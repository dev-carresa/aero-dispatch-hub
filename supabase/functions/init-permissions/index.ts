
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  try {
    // Handle CORS preflight request
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    // Parse the request body
    const { action } = await req.json();
    
    if (!action) {
      throw new Error("action is required");
    }

    const url = Deno.env.get("SUPABASE_URL") as string;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log(`Executing action: ${action}`);

    let result;
    
    if (action === "create_functions") {
      // Create the database functions for permissions
      const { data, error } = await supabase.rpc("admin_create_permission_functions");
      if (error) throw error;
      result = { message: "Permission functions created successfully" };
    } 
    else if (action === "seed_data") {
      // Seed the roles and permissions data
      const { data, error } = await supabase.rpc("admin_seed_roles_and_permissions");
      if (error) throw error;
      result = { message: "Roles and permissions seeded successfully" };
    }
    else if (action === "check_initialization") {
      // Check if permissions system is initialized by checking for roles
      const { data, error } = await supabase.from("roles")
        .select("id")
        .limit(1);
      
      if (error) throw error;
      
      result = { 
        initialized: data && data.length > 0,
        rolesCount: data?.length || 0
      };
    }
    else {
      throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in init-permissions function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
