
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BookingFormData } from "@/lib/schemas/bookingSchema";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useBookings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Create new booking
  const createBooking = async (data: BookingFormData) => {
    if (!user) {
      throw new Error("You must be logged in to create a booking");
    }

    try {
      setLoading(true);
      // Add user_id to booking data
      const bookingWithUser = {
        ...data,
        user_id: user.id,
      };

      const { data: newBooking, error } = await supabase
        .from("bookings_data")
        .insert([bookingWithUser])
        .select()
        .single();

      if (error) throw error;

      return newBooking;
    } catch (error: any) {
      console.error("Error creating booking:", error);
      throw new Error(`Error creating booking: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Update existing booking
  const updateBooking = async ({ id, data }: { id: string; data: BookingFormData }) => {
    if (!user) {
      throw new Error("You must be logged in to update a booking");
    }

    try {
      setLoading(true);
      const { data: updatedBooking, error } = await supabase
        .from("bookings_data")
        .update({ ...data })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return updatedBooking;
    } catch (error: any) {
      console.error("Error updating booking:", error);
      throw new Error(`Error updating booking: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get booking by ID
  const fetchBookingById = async (id: string) => {
    if (!id) return null;

    try {
      const { data, error } = await supabase
        .from("bookings_data")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Error fetching booking:", error);
      throw new Error(`Error fetching booking: ${error.message}`);
    }
  };

  // Fetch all bookings for current user with pagination
  const fetchBookings = async ({ page = 1, pageSize = 10 }) => {
    if (!user) {
      return { data: [], count: 0 };
    }

    try {
      // Get count first
      const { count, error: countError } = await supabase
        .from("bookings_data")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (countError) throw countError;

      // Then get paginated data
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await supabase
        .from("bookings_data")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
      };
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      throw new Error(`Error fetching bookings: ${error.message}`);
    }
  };

  // React Query hooks
  const useCreateBookingMutation = () => {
    return useMutation({
      mutationFn: createBooking,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
        toast.success("Booking created successfully");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  };

  const useUpdateBookingMutation = () => {
    return useMutation({
      mutationFn: updateBooking,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
        toast.success("Booking updated successfully");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  };

  const useBookingsQuery = (page = 1, pageSize = 10) => {
    return useQuery({
      queryKey: ["bookings", page, pageSize],
      queryFn: () => fetchBookings({ page, pageSize }),
      enabled: !!user,
    });
  };

  const useBookingQuery = (id?: string) => {
    return useQuery({
      queryKey: ["booking", id],
      queryFn: () => fetchBookingById(id!),
      enabled: !!id && !!user,
    });
  };

  return {
    loading,
    createBooking,
    updateBooking,
    fetchBookingById,
    fetchBookings,
    useCreateBookingMutation,
    useUpdateBookingMutation,
    useBookingsQuery,
    useBookingQuery,
  };
}
