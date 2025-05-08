
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseClient } from "../_shared/supabase-client.ts";

interface RequestBody {
  useStoredCredentials?: boolean;
}

// Static credentials for authentication
const STATIC_CREDENTIALS = {
  username: "1ej3odu98odoamfpml0lupclbo",
  password: "1u7bc2njok72t1spnbjqt019l4eiiva79u8rnsfjsq3ls761b552"
};

// Booking.com API OAuth token endpoint
const BOOKING_AUTH_URL = "https://auth.dispatchapi.taxi.booking.com/oauth2/token";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const { useStoredCredentials } = await req.json() as RequestBody;
    
    // Use static credentials directly
    const credentialsToUse = {
      username: STATIC_CREDENTIALS.username,
      password: STATIC_CREDENTIALS.password
    };
    
    // Prepare the OAuth request body using form data
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    
    // Make the OAuth token request with Basic Auth
    const response = await fetch(BOOKING_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${credentialsToUse.username}:${credentialsToUse.password}`)}`
      },
      body: formData.toString()
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("OAuth token error:", data);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: data.error_description || data.error || "Failed to authenticate with Booking.com API"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: response.status }
      );
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
