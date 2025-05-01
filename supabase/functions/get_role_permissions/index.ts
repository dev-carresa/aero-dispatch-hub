
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    const url = Deno.env.get("SUPABASE_URL") as string;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Call the RPC function
    const { data: rawData, error } = await supabase.rpc("get_role_permissions");
    
    if (error) throw error;

    // Transform the data to group permissions by role_id
    const rolePermissionsMap = new Map();
    
    for (const item of rawData) {
      const roleId = item.role_id;
      const permissionName = item.permission_name;
      
      if (!rolePermissionsMap.has(roleId)) {
        rolePermissionsMap.set(roleId, {
          role_id: roleId,
          permissions: []
        });
      }
      
      rolePermissionsMap.get(roleId).permissions.push(permissionName);
    }
    
    const result = Array.from(rolePermissionsMap.values());

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
