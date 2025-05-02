import { supabase } from "@/integrations/supabase/client";
import { BookingFormData } from "@/lib/schemas/bookingSchema";

export const bookingService = {
  async createBooking(bookingData: BookingFormData) {
    const { data: userData } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('bookings_data')
      .insert({
        customer_name: bookingData.customerName,
        email: bookingData.email,
        phone: bookingData.phone,
        status: bookingData.status,
        pickup_location: bookingData.pickupLocation,
        destination: bookingData.destination,
        pickup_date: bookingData.pickupDate ? bookingData.pickupDate.toISOString().split('T')[0] : null,
        pickup_time: bookingData.pickupTime,
        vehicle_type: bookingData.vehicleType,
        passenger_count: bookingData.passengerCount,
        luggage_count: bookingData.luggageCount,
        flight_number: bookingData.flightNumber,
        special_instructions: bookingData.specialInstructions,
        price: bookingData.price,
        payment_method: bookingData.paymentMethod,
        payment_status: bookingData.paymentStatus,
        payment_notes: bookingData.paymentNotes,
        admin_notes: bookingData.adminNotes,
        driver_notes: bookingData.driverNotes,
        driver_income: bookingData.driverIncome,
        fleet_income: bookingData.fleetIncome,
        tracking_status: bookingData.trackingStatus,
        user_id: userData.user?.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }

    return data;
  },

  async getBookings() {
    const { data, error } = await supabase
      .from('bookings_data')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }

    return data;
  },

  async getBookingById(id: string) {
    const { data, error } = await supabase
      .from('bookings_data')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }

    return data;
  },

  async updateBooking(id: string, bookingData: Partial<BookingFormData>) {
    const { data, error } = await supabase
      .from('bookings_data')
      .update({
        customer_name: bookingData.customerName,
        email: bookingData.email,
        phone: bookingData.phone,
        status: bookingData.status,
        pickup_location: bookingData.pickupLocation,
        destination: bookingData.destination,
        pickup_date: bookingData.pickupDate ? bookingData.pickupDate.toISOString().split('T')[0] : undefined,
        pickup_time: bookingData.pickupTime,
        vehicle_type: bookingData.vehicleType,
        passenger_count: bookingData.passengerCount,
        luggage_count: bookingData.luggageCount,
        flight_number: bookingData.flightNumber,
        special_instructions: bookingData.specialInstructions,
        price: bookingData.price,
        payment_method: bookingData.paymentMethod,
        payment_status: bookingData.paymentStatus,
        payment_notes: bookingData.paymentNotes,
        admin_notes: bookingData.adminNotes,
        driver_notes: bookingData.driverNotes,
        driver_income: bookingData.driverIncome,
        fleet_income: bookingData.fleetIncome,
        tracking_status: bookingData.trackingStatus
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking:', error);
      throw error;
    }

    return data;
  },

  async deleteBooking(id: string) {
    const { error } = await supabase
      .from('bookings_data')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }

    return true;
  }
};
