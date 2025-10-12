'use client';

import { useEffect } from 'react';
import { useFlightContext } from '@/context/useFlightContext';
import { useRouter } from 'next/navigation';
import BookingConfirmation from '@/components/flights/BookingConfirmation';

/**
 * Flight Booking Confirmation Page
 * Success page after booking
 */
const FlightConfirmationPage = () => {
  const router = useRouter();
  const { currentBooking, resetBookingFlow } = useFlightContext();

  // Redirect if no booking
  useEffect(() => {
    if (!currentBooking) {
      router.push('/flights/search');
    }
  }, [currentBooking, router]);

  const handleViewBooking = (bookingId) => {
    router.push(`/flights/bookings/${bookingId}`);
  };

  const handleNewSearch = () => {
    resetBookingFlow();
    router.push('/flights/search');
  };

  if (!currentBooking) {
    return null;
  }

  return (
    <BookingConfirmation
      booking={currentBooking}
      onViewBooking={handleViewBooking}
      onNewSearch={handleNewSearch}
    />
  );
};

export default FlightConfirmationPage;

