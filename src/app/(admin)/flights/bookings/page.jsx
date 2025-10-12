'use client';

import { useEffect } from 'react';
import { useFlightContext } from '@/context/useFlightContext';
import { useRouter } from 'next/navigation';
import PageTitle from '@/components/PageTitle';
import MyBookingsList from '@/components/flights/MyBookingsList';
import { useNotificationContext } from '@/context/useNotificationContext';
import { cancelFlightOrder } from '@/services/flightsService';

/**
 * My Flight Bookings Page
 * List of user's flight bookings
 */
const MyFlightBookingsPage = () => {
  const router = useRouter();
  const { showSuccess, showError } = useNotificationContext();
  const { myBookings, isLoadingBookings, loadMyBookings } = useFlightContext();

  // Load bookings on mount
  useEffect(() => {
    loadMyBookings().catch((error) => {
      console.error('Error loading bookings:', error);
      showError('Failed to load bookings');
    });
  }, []);

  const handleViewDetails = (bookingId) => {
    router.push(`/flights/bookings/${bookingId}`);
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelFlightOrder(bookingId);
      showSuccess('Booking cancelled successfully');
      
      // Reload bookings
      loadMyBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showError('Failed to cancel booking');
    }
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Flights', path: '/flights/search' },
          { label: 'My Bookings', path: '/flights/bookings', active: true }
        ]}
        title="My Flight Bookings"
      />

      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <MyBookingsList
              bookings={myBookings}
              onViewDetails={handleViewDetails}
              onCancelBooking={handleCancelBooking}
              isLoading={isLoadingBookings}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyFlightBookingsPage;

