
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface RequestBody {
  source: string;
  params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
    page?: number;
  };
  credentials?: {
    username: string;
    password: string;
  };
  oauthToken?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const { source, params, credentials, oauthToken } = await req.json() as RequestBody;
    
    if (!source) {
      return new Response(
        JSON.stringify({ error: "Source is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    if (!credentials && !oauthToken) {
      return new Response(
        JSON.stringify({ error: "Either credentials or OAuth token is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // For Booking.com API, fetch bookings from the API
    if (source.toLowerCase() === 'booking.com') {
      // This would normally be a real API endpoint, but for testing we'll use mock data
      // In a real implementation, you would make an HTTP request to the actual Booking.com API endpoint
      
      // Determine which authentication method to use
      let headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      
      if (oauthToken) {
        // Use OAuth token if available
        headers["Authorization"] = `Bearer ${oauthToken}`;
      } else if (credentials) {
        // Fall back to Basic Auth if no token
        headers["Authorization"] = `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
      }
      
      // For testing/demo purposes, return mock data
      // In a real implementation, make the actual API request here
      const mockBookings = [
        {
          id: "B12345",
          reservation_id: "BR12345",
          check_in: params?.startDate || "2023-12-01",
          check_out: params?.endDate || "2023-12-05",
          status: "confirmed",
          guest: {
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
            phone: "+1234567890"
          },
          room_details: {
            room_type: "Deluxe Room",
            guests: 2
          },
          property: {
            name: "Luxury Hotel",
            address: "123 Main St",
            city: "New York",
            country: "USA"
          },
          price_details: {
            total_price: 550,
            currency: "USD"
          },
          special_requests: "Late check-in",
          created_at: "2023-11-15T10:30:00Z",
          updated_at: "2023-11-15T10:30:00Z"
        },
        {
          id: "B12346",
          reservation_id: "BR12346",
          check_in: params?.startDate || "2023-12-03",
          check_out: params?.endDate || "2023-12-07",
          status: "confirmed",
          guest: {
            first_name: "Jane",
            last_name: "Smith",
            email: "jane.smith@example.com",
            phone: "+1987654321"
          },
          room_details: {
            room_type: "Executive Suite",
            guests: 3
          },
          property: {
            name: "Luxury Hotel",
            address: "123 Main St",
            city: "New York",
            country: "USA"
          },
          price_details: {
            total_price: 850,
            currency: "USD"
          },
          created_at: "2023-11-16T14:45:00Z",
          updated_at: "2023-11-16T14:45:00Z"
        }
      ];
      
      return new Response(
        JSON.stringify({ 
          bookings: mockBookings,
          meta: {
            count: mockBookings.length,
            page: params?.page || 1,
            pages: 1
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // For other API sources
    return new Response(
      JSON.stringify({ error: `Fetching bookings from ${source} is not implemented yet` }),
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
