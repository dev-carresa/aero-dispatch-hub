
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
    limit?: number;
  };
  token?: string;
}

// Booking.com API endpoints
const BOOKING_API_URL = "https://dispatchapi.taxi.booking.com/v1/bookings";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const { source, params, token } = await req.json() as RequestBody;
    
    if (!source) {
      return new Response(
        JSON.stringify({ error: "Source is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // For Booking.com API with OAuth
    if (source.toLowerCase() === 'booking.com') {
      // Check if token is provided
      if (!token) {
        return new Response(
          JSON.stringify({ error: "Authentication token is required for Booking.com API" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
        );
      }
      
      // Prepare query parameters
      const queryParams = new URLSearchParams();
      
      if (params.startDate) queryParams.append('start_date', params.startDate);
      if (params.endDate) queryParams.append('end_date', params.endDate);
      if (params.status) queryParams.append('status', params.status);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      const apiUrl = `${BOOKING_API_URL}?${queryParams.toString()}`;
      
      // Make request to Booking.com API with the provided OAuth token
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Booking.com API error:", errorData);
        
        return new Response(
          JSON.stringify({ 
            error: errorData.message || `Error fetching bookings: ${response.status} ${response.statusText}`
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: response.status }
        );
      }
      
      // Process the successful response
      const bookingData = await response.json();
      
      return new Response(
        JSON.stringify(bookingData),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // For other sources or when testing (using mock data)
    if (source.toLowerCase() === 'booking.com.mock') {
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
