
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseClient } from "../_shared/supabase-client.ts";

interface RequestBody {
  source: string;
  bookings: any[];
}

// Map a Booking.com booking to our internal format
function mapBookingToInternalFormat(booking: any, source: string) {
  console.log("Mapping booking:", JSON.stringify(booking));
  
  // Get guest information with fallbacks
  const guestName = booking.passenger?.name || 
    (booking.guest ? `${booking.guest.first_name || ''} ${booking.guest.last_name || ''}`.trim() : 'Guest');
  
  const email = booking.guest?.email || booking.passenger?.email || 'guest@example.com';
  const phone = booking.guest?.phone || booking.passenger?.telephone_number || 'N/A';
  
  // Get location information with fallbacks
  const pickupLocation = booking.pickup?.address || 
    booking.property?.address || 
    'Not specified';
    
  const destination = booking.dropoff?.address || 
    booking.property?.name || 
    'Not specified';
  
  // Get coordinates with fallbacks
  const pickupLatitude = booking.pickup?.coordinates?.latitude || 
    booking.property?.location?.coordinates?.latitude || null;
    
  const pickupLongitude = booking.pickup?.coordinates?.longitude || 
    booking.property?.location?.coordinates?.longitude || null;
    
  const destinationLatitude = booking.dropoff?.coordinates?.latitude || null;
  const destinationLongitude = booking.dropoff?.coordinates?.longitude || null;
  
  // Get date information with fallbacks
  const pickupTime = booking.check_in_time || '12:00';
  const pickupDate = booking.check_in || new Date().toISOString().split('T')[0];
  
  // Get price information with fallbacks
  let price = 0;
  if (booking.price_details?.total_price) {
    price = parseFloat(booking.price_details.total_price);
  } else if (booking.price?.amount) {
    price = parseFloat(booking.price.amount);
  }
  
  // Get passenger count with fallbacks
  const passengerCount = booking.room_details?.guests || booking.passenger_count || 1;
  
  // Use various ID fields with fallbacks
  const externalId = booking.id || booking.reference || booking.legId || booking.bookingReference || 
    booking.customerReference || `${source}-${new Date().getTime()}`;
  
  console.log("External ID determined as:", externalId);
  
  // Flight number if available
  const flightNumber = booking.flight_number || null;
  
  return {
    customer_name: guestName,
    email: email,
    phone: phone,
    status: 'pending',
    pickup_location: pickupLocation,
    destination: destination,
    pickup_latitude: pickupLatitude,
    pickup_longitude: pickupLongitude,
    destination_latitude: destinationLatitude,
    destination_longitude: destinationLongitude,
    vehicle_type: 'sedan',
    pickup_time: pickupTime,
    pickup_date: pickupDate,
    flight_number: flightNumber,
    price: price,
    passenger_count: passengerCount,
    luggage_count: 1,
    payment_method: 'credit-card',
    payment_status: 'pending',
    source: source.toLowerCase(),
    reference_source: externalId,
    external_id: externalId,
    external_source: source.toLowerCase(),
    raw_booking_data: booking
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    console.log("Request received in save-external-bookings");
    const { source, bookings } = await req.json() as RequestBody;
    
    if (!source || !bookings || !Array.isArray(bookings)) {
      console.error("Invalid request: missing source or bookings array");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Source and bookings array are required" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Processing ${bookings.length} bookings from ${source}`);
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ success: false, message: "Authentication required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    let saved = 0;
    let errors = 0;
    let duplicates = 0;
    
    // Process each booking and save directly to bookings_data
    for (const booking of bookings) {
      // Debug logging of the booking object
      console.log("Processing booking:", JSON.stringify({
        id: booking.id,
        reference: booking.reference,
        legId: booking.legId,
        bookingReference: booking.bookingReference,
        customerReference: booking.customerReference
      }));
      
      const externalId = booking.id || booking.reference || booking.legId || booking.bookingReference || booking.customerReference;
      
      if (!externalId) {
        console.error("No external ID found for booking", booking);
        errors++;
        continue;
      }
      
      try {
        // Check if this booking already exists
        const { data: existingBooking } = await supabaseClient
          .from('bookings_data')
          .select('id')
          .eq('external_source', source.toLowerCase())
          .eq('external_id', externalId)
          .maybeSingle();
          
        if (existingBooking) {
          console.log(`Booking with external ID ${externalId} already exists, skipping`);
          duplicates++;
          continue;
        }
        
        // Map and save the booking directly to bookings_data
        const mappedBooking = mapBookingToInternalFormat(booking, source);
        
        // Add user_id to the booking data
        mappedBooking.user_id = user.id;
        
        console.log(`Saving booking with external ID ${externalId}`);
        
        const { error: insertError } = await supabaseClient
          .from('bookings_data')
          .insert([mappedBooking]);
          
        if (insertError) {
          console.error("Error inserting booking:", insertError);
          errors++;
        } else {
          console.log(`Successfully saved booking with external ID ${externalId}`);
          saved++;
        }
      } catch (error) {
        console.error("Error processing booking:", error);
        errors++;
      }
    }
    
    const result = {
      success: true,
      saved,
      errors,
      duplicates
    };
    
    console.log("Result:", result);
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error saving bookings:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
