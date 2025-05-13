
import React from 'react';
import { BookingApiTestTabs } from './BookingApiTestTabs';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Spinner } from '@/components/ui/spinner';

const BookingApiTestPage = () => {
  const { loading } = useRequireAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">External Booking API Integration</h2>
        <p className="text-muted-foreground">
          Test connections and import bookings from external systems
        </p>
      </div>
      
      <BookingApiTestTabs />
    </div>
  );
};

export default BookingApiTestPage;
