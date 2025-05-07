
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseClient } from "../_shared/supabase-client.ts";

interface RequestBody {
  source: string;
}

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
    
    // Get the API key from Supabase
    const { data: apiIntegration, error: apiError } = await supabaseClient
      .from('api_integrations')
      .select('key_value, status')
      .eq('key_name', `${source.toUpperCase()}_API_KEY`)
      .maybeSingle();
      
    if (apiError) {
      throw apiError;
    }
    
    if (!apiIntegration || !apiIntegration.key_value) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `API key for ${source} is not configured` 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    // For Booking.com, attempt to make a simple API call to verify the key
    if (source.toLowerCase() === 'booking.com') {
      const apiKey = apiIntegration.key_value;
      const testUrl = "https://distribution-xml.booking.com/json/getHotels";
      
      const response = await fetch(testUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(`${apiKey}:`)}`
        },
        body: JSON.stringify({
          request: {
            authentication: {
              apiKey
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
