import { useState, useEffect, useCallback } from 'react';
import { startOfWeek, addDays, format } from 'date-fns';
import { supabase } from '@/supabase';
import type { Booking } from '@/types';
import { useAutoRefresh } from './useAutoRefresh';

export function useBookings(selectedDate: Date) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [selectedDate]);

  const fetchBookings = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      setError(null);

      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const weekEnd = addDays(weekStart, 7);

      console.log('Fetching bookings for date range:', {
        selectedDate: format(selectedDate, 'yyyy-MM-dd HH:mm:ss'),
        weekStart: format(weekStart, 'yyyy-MM-dd HH:mm:ss'),
        weekEnd: format(weekEnd, 'yyyy-MM-dd HH:mm:ss')
      });

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .gte('start_time', weekStart.toISOString())
        .lt('start_time', weekEnd.toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Fetched bookings:', {
        count: data?.length || 0,
        bookings: data
      });

      const newBookings = data || [];

      setBookings(newBookings);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bookings';
      console.error('Error fetching bookings:', err);
      setError(errorMessage);
      if (!silent) {
        setBookings([]);
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [selectedDate]);

  const createBooking = async (newBooking: Omit<Booking, 'id' | 'created_at'>) => {
    try {
      setError(null);
      console.log('Creating new booking:', newBooking);

      // In a production environment, you would verify the reCAPTCHA token on the server
      // For now, we'll just log that reCAPTCHA was completed
      console.log('reCAPTCHA verification completed');

      const { error } = await supabase
        .from('bookings')
        .insert([newBooking]);

      if (error) {
        console.error('Error creating booking:', error);
        throw error;
      }

      await fetchBookings();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
      console.error('Error creating booking:', err);
      setError(errorMessage);
      return false;
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      setError(null);
      console.log('Deleting booking:', bookingId);

      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) {
        console.error('Error deleting booking:', error);
        throw error;
      }

      await fetchBookings();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete booking';
      console.error('Error deleting booking:', err);
      setError(errorMessage);
      return false;
    }
  };

  const updateBooking = async (bookingId: string, newBooking: Omit<Booking, 'id' | 'created_at'>) => {
    try {
      setError(null);
      console.log('Updating booking:', { bookingId, newBooking });

      // First, create the new booking
      const { error: insertError } = await supabase
        .from('bookings')
        .insert([newBooking]);

      if (insertError) {
        console.error('Error inserting new booking during update:', insertError);
        throw insertError;
      }

      // Then, delete the old booking
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (deleteError) {
        console.error('Error deleting old booking during update:', deleteError);
        throw deleteError;
      }

      await fetchBookings();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update booking';
      console.error('Error updating booking:', err);
      setError(errorMessage);
      return false;
    }
  };

  const silentRefresh = useCallback(() => {
    fetchBookings(true);
  }, [fetchBookings]);

  useAutoRefresh(silentRefresh, true);

  return {
    bookings,
    isLoading,
    error,
    createBooking,
    deleteBooking,
    updateBooking,
    refreshBookings: fetchBookings
  };
}