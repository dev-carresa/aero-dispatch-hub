
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseClient } from "../_shared/supabase-client.ts";

interface RequestBody {
  source: string;
  params: {
    startDate?: string;
    endDate?: string;
    status?: string;
    page?: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const { source, params } = await req.json() as RequestBody;
    
    if (!source) {
      return new Response(
        JSON.stringify({ error: "Source is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Get the API key from Supabase
    const { data: apiIntegration, error: apiError } = await supabaseClient
      .from('api_integrations')
      .select('key_value')
      .eq('key_name', `${source.toUpperCase()}_API_KEY`)
      .maybeSingle();
      
    if (apiError) {
      throw apiError;
    }
    
    if (!apiIntegration || !apiIntegration.key_value) {
      return new Response(
        JSON.stringify({ error: `API key for ${source} is not configured` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    const apiKey = apiIntegration.key_value;
    
    // In a real implementation, you would call the actual Booking.com API
    // For this demo, we'll return mock data that matches the expected structure
    if (source.toLowerCase() === 'booking.com') {
      // This is mock data, in a real implementation you'd call the Booking.com API
      const mockBookings = Array(10).fill(null).map((_, index) => ({
        id: `booking-${index + 1}-${Date.now()}`,
        reservation_id: `RES-${1000 + index}`,
        status: ["confirmed", "pending", "cancelled"][Math.floor(Math.random() * 3)],
        check_in: new Date(Date.now() + (86400000 * index)).toISOString().split('T')[0],
        check_out: new Date(Date.now() + (86400000 * (index + 3))).toISOString().split('T')[0],
        guest: {
          first_name: ["John", "Jane", "Robert", "Mary", "Michael"][Math.floor(Math.random() * 5)],
          last_name: ["Smith", "Johnson", "Williams", "Jones", "Brown"][Math.floor(Math.random() * 5)],
          email: `guest${index + 1}@example.com`,
          phone: `+1-555-${100 + index}-${1000 + index}`
        },
        room_details: {
          room_type: ["Standard", "Deluxe", "Suite", "Executive"][Math.floor(Math.random() * 4)],
          guests: Math.floor(Math.random() * 3) + 1
        },
        property: {
          name: "Test Hotel",
          address: "123 Main St",
          city: "Test City",
          country: "Test Country"
        },
        price_details: {
          total_price: Math.floor(Math.random() * 500) + 100,
          currency: "USD"
        },
        special_requests: Math.random() > 0.7 ? "Late check-in requested" : "",
        created_at: new Date(Date.now() - (86400000 * 10)).toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      return new Response(
        JSON.stringify({
          bookings: mockBookings,
          status: "success",
          meta: {
            count: mockBookings.length,
            page: params.page || 1,
            pages: 5
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // For other API sources (placeholder)
    return new Response(
      JSON.stringify({ error: `API fetching for ${source} is not implemented yet` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
    
  } catch (error) {
    console.error("Error fetching external bookings:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
