
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseClient } from "../_shared/supabase-client.ts";

interface RequestBody {
  source: string;
  bookings: any[];
}

// Map a booking to our internal format - enhanced to handle different API response formats
function mapBookingToInternalFormat(booking: any, source: string) {
  // Handle name from different formats
  let customerName = "Guest";
  
  if (booking.passenger?.name) {
    customerName = booking.passenger.name;
  } else if (booking.guest) {
    customerName = `${booking.guest.first_name || ''} ${booking.guest.last_name || ''}`.trim();
  }
  
  // Handle contact details with fallbacks
  const email = booking.passenger?.email || booking.guest?.email || 'guest@example.com';
  const phone = booking.passenger?.telephone_number || booking.guest?.phone || 'N/A';
  
  // Handle pickup location with fallbacks
  const pickupLocation = booking.pickup?.address || 
    booking.property?.address || 
    'Not specified';
    
  // Handle destination with fallbacks
  const destination = booking.dropoff?.address || 
    booking.property?.name || 
    'Not specified';
  
  // Handle coordinates with fallbacks
  const pickupLatitude = booking.pickup?.latitude || 
    booking.property?.location?.coordinates?.latitude || null;
    
  const pickupLongitude = booking.pickup?.longitude || 
    booking.property?.location?.coordinates?.longitude || null;
    
  const destinationLatitude = booking.dropoff?.latitude || null;
  const destinationLongitude = booking.dropoff?.longitude || null;
  
  // Handle time information - supporting multiple formats
  const pickupTime = booking.pickup_date_time 
    ? new Date(booking.pickup_date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : booking.check_in_time || '12:00';
    
  // Handle date information with fallbacks
  const pickupDate = booking.pickup_date_time 
    ? new Date(booking.pickup_date_time).toISOString().split('T')[0] 
    : booking.check_in || new Date().toISOString().split('T')[0];
  
  // Handle price information with fallbacks
  let price = 0;
  if (booking.price?.amount) {
    price = parseFloat(booking.price.amount);
  } else if (booking.price?.customerOriginalPrice) {
    price = booking.price.customerOriginalPrice;
  } else if (booking.price_details?.total_price) {
    price = booking.price_details.total_price;
  }
  
  // Get passenger count with fallbacks
  const passengerCount = booking.passenger_count || booking.room_details?.guests || 1;
  
  // Use various ID fields with fallbacks
  const externalId = booking.bookingReference || booking.reference || 
    booking.customerReference || booking.legId || booking.id || 
    `${source}-${new Date().getTime()}`;
  
  // Flight number if available
  const flightNumber = booking.flight_number || null;
  
  // Get vehicle type with standardization
  const vehicleType = (booking.vehicle_type || 'sedan').toLowerCase();
  
  return {
    customer_name: customerName,
    email: email,
    phone: phone,
    status: 'pending',
    pickup_location: pickupLocation,
    destination: destination,
    pickup_latitude: pickupLatitude,
    pickup_longitude: pickupLongitude,
    destination_latitude: destinationLatitude,
    destination_longitude: destinationLongitude,
    vehicle_type: vehicleType,
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
    
    // Process each booking and save directly to bookings_data
    for (const booking of bookings) {
      // Extract external ID using multiple possible properties
      const externalId = booking.bookingReference || booking.reference || 
        booking.customerReference || booking.legId || booking.id;
      
      if (!externalId) {
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
          duplicates++;
          continue;
        }
        
        // Map and save the booking directly to bookings_data
        const mappedBooking = mapBookingToInternalFormat(booking, source);
        
        // Add user_id to the booking data
        mappedBooking.user_id = user.id;
        
        const { error: insertError } = await supabaseClient
          .from('bookings_data')
          .insert([mappedBooking]);
          
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
    console.error("Error saving bookings:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
