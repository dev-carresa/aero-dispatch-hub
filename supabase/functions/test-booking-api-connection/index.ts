
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseClient } from "../_shared/supabase-client.ts";

interface RequestBody {
  source: string;
}

// Static credentials for authentication
const STATIC_CREDENTIALS = {
  username: "1ej3odu98odoamfpml0lupclbo",
  password: "1u7bc2njok72t1spnbjqt019l4eiiva79u8rnsfjsq3ls761b552"
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const { source } = await req.json() as RequestBody;
    
    if (!source) {
      return new Response(
        JSON.stringify({ success: false, message: "Source is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Use static credentials instead of fetching from database
    const apiKey = STATIC_CREDENTIALS.username;
    const apiPassword = STATIC_CREDENTIALS.password;
    
    if (!apiKey || !apiPassword) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `API credentials for ${source} are not properly configured` 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    // For Booking.com, attempt to make a simple API call to verify the key
    if (source.toLowerCase() === 'booking.com') {
      const testUrl = "https://distribution-xml.booking.com/json/getHotels";
      
      const response = await fetch(testUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(`${apiKey}:${apiPassword}`)}`
        },
        body: JSON.stringify({
          request: {
            authentication: {
              username: apiKey,
              password: apiPassword
            },
            // Minimal request just to test connectivity
            stay: {
              checkIn: "2023-12-01",
              checkOut: "2023-12-02"
            },
            rooms: [{ adults: 1 }]
          }
        })
      });
      
      const responseStatus = response.status;
      
      // Update the API integration status based on the response
      await supabaseClient
        .from('api_integrations')
        .update({ 
          status: responseStatus >= 200 && responseStatus < 300 ? 'connected' : 'error',
          last_tested: new Date().toISOString()
        })
        .eq('key_name', `${source.toUpperCase()}_API_KEY`);
      
      if (responseStatus >= 200 && responseStatus < 300) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Successfully connected to ${source} API` 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        const errorText = await response.text();
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `Failed to connect to ${source} API: ${errorText}` 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // For other API sources (placeholder)
    return new Response(
      JSON.stringify({ success: false, message: `API testing for ${source} is not implemented yet` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
    
  } catch (error) {
    console.error("Error testing API connection:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
