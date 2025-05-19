
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

const BOOKING_API_ENDPOINT = "https://dispatchapi.taxi.booking.com/v1/bookings";

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
      // Determine which authentication method to use
      let headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Accept": "application/json"
      };
      
      if (oauthToken) {
        // Use OAuth token if available
        headers["Authorization"] = `Bearer ${oauthToken}`;
        
        console.log("Making request to Booking.com API with OAuth token");
        
        try {
          // Make the actual API request to the Booking.com API
          const response = await fetch(BOOKING_API_ENDPOINT, {
            method: "GET",
            headers: headers
          });
          
          console.log(`API response status: ${response.status}`);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error("API error response:", errorText);
            throw new Error(`API request failed with status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log("API response received successfully");
          
          return new Response(
            JSON.stringify({ 
              bookings: data.bookings || data,
              meta: data.meta || { 
                count: Array.isArray(data.bookings) ? data.bookings.length : 
                       (Array.isArray(data) ? data.length : 0) 
              }
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
          
        } catch (apiError: any) {
          console.error("API request error:", apiError);
          
          // Fallback to mock data for development/testing if the API is not available
          console.log("Using mock data as fallback due to API error");
          
          const mockBookings = [
            {
              id: "B12345",
              reservation_id: "BR12345",
              check_in: "2023-12-01",
              check_out: "2023-12-05",
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
              check_in: "2023-12-03",
              check_out: "2023-12-07",
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
            },
            {
              id: "B12347",
              reservation_id: "BR12347",
              check_in: "2023-12-10",
              check_out: "2023-12-15",
              status: "confirmed",
              guest: {
                first_name: "Robert",
                last_name: "Johnson",
                email: "robert.j@example.com",
                phone: "+1555666777"
              },
              room_details: {
                room_type: "Standard Room",
                guests: 1
              },
              property: {
                name: "Luxury Hotel",
                address: "123 Main St",
                city: "New York",
                country: "USA"
              },
              price_details: {
                total_price: 450,
                currency: "USD"
              },
              created_at: "2023-11-17T09:20:00Z",
              updated_at: "2023-11-17T09:20:00Z"
            }
          ];
          
          return new Response(
            JSON.stringify({ 
              bookings: mockBookings,
              meta: {
                count: mockBookings.length,
                total: mockBookings.length
              },
              error: apiError.message || "Failed to fetch from API, using mock data"
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } else if (credentials) {
        // Fall back to Basic Auth if no token - now deprecated in favor of OAuth
        return new Response(
          JSON.stringify({ error: "Basic auth is no longer supported. Please use OAuth token." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
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
