
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseClient } from "../_shared/supabase-client.ts";

interface RequestBody {
  clientId?: string;
  clientSecret?: string;
  useStoredCredentials?: boolean;
}

// Booking.com API OAuth token endpoint
const BOOKING_AUTH_URL = "https://auth.dispatchapi.taxi.booking.com/oauth2/token";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const { clientId, clientSecret, useStoredCredentials } = await req.json() as RequestBody;
    
    let credentialsToUse = {
      clientId: clientId || "",
      clientSecret: clientSecret || ""
    };
    
    // If requested to use stored credentials, fetch from Supabase
    if (useStoredCredentials) {
      // Get the API keys from Supabase
      const clientIdResult = await supabaseClient
        .from('api_integrations')
        .select('key_value')
        .eq('key_name', 'bookingComClientId')
        .maybeSingle();
        
      const clientSecretResult = await supabaseClient
        .from('api_integrations')
        .select('key_value')
        .eq('key_name', 'bookingComClientSecret')
        .maybeSingle();
      
      if (clientIdResult.error || clientSecretResult.error) {
        throw new Error("Failed to retrieve stored API credentials");
      }
      
      if (!clientIdResult.data?.key_value || !clientSecretResult.data?.key_value) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "API credentials not configured. Please set Client ID and Client Secret in Settings > API > Travel section." 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
      
      credentialsToUse = {
        clientId: clientIdResult.data.key_value,
        clientSecret: clientSecretResult.data.key_value
      };
    }
    
    // Validate credentials
    if (!credentialsToUse.clientId || !credentialsToUse.clientSecret) {
      return new Response(
        JSON.stringify({ success: false, error: "Client ID and Client Secret are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Prepare the OAuth request body
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', credentialsToUse.clientId);
    formData.append('client_secret', credentialsToUse.clientSecret);
    
    // Make the OAuth token request
    const response = await fetch(BOOKING_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("OAuth token error:", data);
      
      // Store the error in db for diagnostic purposes
      await supabaseClient
        .from('api_integrations')
        .update({ 
          status: 'error',
          error: `OAuth error: ${data.error || 'Unknown error'}`,
          last_tested: new Date().toISOString()
        })
        .eq('key_name', 'bookingComClientId');
        
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: data.error_description || data.error || "Failed to authenticate with Booking.com API"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: response.status }
      );
    }
    
    // On success, update the status in the database
    if (useStoredCredentials) {
      await supabaseClient
        .from('api_integrations')
        .update({ 
          status: 'connected',
          error: null,
          last_tested: new Date().toISOString()
        })
        .eq('key_name', 'bookingComClientId');
    }
    
    // Return the token data
    return new Response(
      JSON.stringify({
        success: true,
        token_type: data.token_type,
        access_token: data.access_token,
        expires_in: data.expires_in,
        received_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in OAuth test:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
