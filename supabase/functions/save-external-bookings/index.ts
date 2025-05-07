
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseClient } from "../_shared/supabase-client.ts";

interface RequestBody {
  source: string;
  bookings: any[];
}

// Map a Booking.com booking to our internal format
function mapBookingComToInternalFormat(booking: any) {
  return {
    external_id: booking.id,
    external_source: 'booking.com',
    booking_data: booking,
    status: 'pending'
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const { source, bookings } = await req.json() as RequestBody;
    
    if (!source || !bookings || !Array.isArray(bookings)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Source and bookings array are required" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, message: "Authentication required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    let saved = 0;
    let errors = 0;
    let duplicates = 0;
    
    // Process each booking
    if (source.toLowerCase() === 'booking.com') {
      for (const booking of bookings) {
        if (!booking.id) {
          errors++;
          continue;
        }
        
        try {
          // Check if this booking already exists
          const { data: existingBooking } = await supabaseClient
            .from('external_bookings')
            .select('id')
            .eq('external_source', 'booking.com')
            .eq('external_id', booking.id)
            .maybeSingle();
            
          if (existingBooking) {
            duplicates++;
            continue;
          }
          
          // Map and save the booking
          const mappedBooking = mapBookingComToInternalFormat(booking);
          
          const { error: insertError } = await supabaseClient
            .from('external_bookings')
            .insert([{
              ...mappedBooking,
              user_id: user.id
            }]);
            
          if (insertError) {
            console.error("Error inserting booking:", insertError);
            errors++;
          } else {
            saved++;
          }
        } catch (error) {
          console.error("Error processing booking:", error);
          errors++;
        }
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        saved,
        errors,
        duplicates
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error saving external bookings:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
