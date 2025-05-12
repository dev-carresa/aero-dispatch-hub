
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseClient } from "../_shared/supabase-client.ts";

interface RequestBody {
  bookingIds: string[];
}

interface ConversionResult {
  success: boolean;
  bookingId: string;
  message: string;
  internalBookingId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const { bookingIds } = await req.json() as RequestBody;
    
    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Booking IDs are required" 
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
    
    const results: ConversionResult[] = [];
    
    // Process each booking
    for (const bookingId of bookingIds) {
      try {
        // Fetch the external booking
        const { data: externalBooking, error: fetchError } = await supabaseClient
          .from('external_bookings')
          .select('*')
          .eq('id', bookingId)
          .single();
        
        if (fetchError || !externalBooking) {
          results.push({
            success: false,
            bookingId,
            message: "External booking not found"
          });
          continue;
        }
        
        // Check if this booking has already been imported
        if (externalBooking.status === 'imported' && externalBooking.mapped_booking_id) {
          results.push({
            success: false,
            bookingId,
            message: "This booking has already been imported",
            internalBookingId: externalBooking.mapped_booking_id
          });
          continue;
        }
        
        // Map external booking to internal format
        const bookingData = externalBooking.booking_data;
        
        // Extract guest info
        const guestName = bookingData.guest ? 
          `${bookingData.guest.first_name || ''} ${bookingData.guest.last_name || ''}`.trim() : 
          'Guest';
        
        const guestEmail = bookingData.guest?.email || 'not-provided@example.com';
        const guestPhone = bookingData.guest?.phone || 'N/A';
        
        // Extract location info
        const pickupLocation = bookingData.property?.address || 'N/A';
        const destination = bookingData.property?.name || 'N/A';
        
        // Extract coordinates if available
        const pickupLatitude = bookingData.pickup?.coordinates?.latitude;
        const pickupLongitude = bookingData.pickup?.coordinates?.longitude;
        const destinationLatitude = bookingData.property?.location?.coordinates?.latitude;
        const destinationLongitude = bookingData.property?.location?.coordinates?.longitude;
        
        // Extract date and time
        const checkInDate = bookingData.check_in || new Date().toISOString().split('T')[0];
        const checkInTime = bookingData.check_in_time || '12:00'; // Default to noon if not provided
        
        // Create a combined datetime for pickup
        let pickupDateTime = null;
        try {
          if (checkInDate && checkInTime) {
            const [hours, minutes] = checkInTime.split(':').map(Number);
            const dateObj = new Date(checkInDate);
            dateObj.setHours(hours || 0);
            dateObj.setMinutes(minutes || 0);
            pickupDateTime = dateObj.toISOString();
          }
        } catch (error) {
          console.error("Error creating pickup datetime:", error);
        }
        
        // Extract price
        const price = bookingData.price_details?.total_price || 0;
        
        // Handle any special instructions
        const specialInstructions = bookingData.special_requests || '';
        
        // Create the internal booking object
        const internalBooking = {
          customer_name: guestName,
          email: guestEmail,
          phone: guestPhone,
          status: 'pending',
          pickup_location: pickupLocation,
          destination: destination,
          pickup_latitude: pickupLatitude,
          pickup_longitude: pickupLongitude,
          destination_latitude: destinationLatitude,
          destination_longitude: destinationLongitude,
          vehicle_type: 'sedan', // Default vehicle type
          pickup_time: checkInTime,
          pickup_date: checkInDate,
          pickup_datetime: pickupDateTime,
          flight_number: bookingData.flight_number,
          price: price,
          passenger_count: bookingData.room_details?.guests || 1,
          luggage_count: 1, // Default luggage count
          payment_method: 'credit-card', // Default payment method
          payment_status: 'pending',
          source: 'booking.com',
          reference_source: externalBooking.external_id,
          external_booking_id: externalBooking.id,
          user_id: user.id
        };
        
        try {
          // Insert the new booking into bookings_data
          const { data: newBooking, error: insertError } = await supabaseClient
            .from('bookings_data')
            .insert([internalBooking])
            .select()
            .single();
          
          if (insertError) throw insertError;
          
          // Update the external booking with the mapped_booking_id
          const { error: updateError } = await supabaseClient
            .from('external_bookings')
            .update({
              mapped_booking_id: newBooking.id,
              status: 'imported',
              updated_at: new Date().toISOString()
            })
            .eq('id', bookingId);
          
          if (updateError) throw updateError;
          
          results.push({
            success: true,
            bookingId,
            message: "Booking successfully imported",
            internalBookingId: newBooking.id
          });
          
        } catch (error) {
          // Update the external booking with error status
          await supabaseClient
            .from('external_bookings')
            .update({
              status: 'error',
              error_message: error.message || "Error during import",
              updated_at: new Date().toISOString()
            })
            .eq('id', bookingId);
          
          results.push({
            success: false,
            bookingId,
            message: error.message || "Error during import"
          });
        }
        
      } catch (error) {
        console.error(`Error processing booking ${bookingId}:`, error);
        results.push({
          success: false,
          bookingId,
          message: error.message || "Unknown error occurred"
        });
      }
    }
    
    // Tally the results
    const successful = results.filter(result => result.success).length;
    const failed = results.filter(result => !result.success).length;
    
    return new Response(
      JSON.stringify({
        success: successful > 0,
        results,
        summary: {
          total: bookingIds.length,
          successful,
          failed
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error converting external bookings:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
