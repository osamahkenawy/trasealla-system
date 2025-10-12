'use client';

import { useEffect, useState } from 'react';
import { useFlightContext } from '@/context/useFlightContext';
import { useRouter } from 'next/navigation';
import PageTitle from '@/components/PageTitle';
import TravelerForm from '@/components/flights/TravelerForm';
import SeatSelection from '@/components/flights/SeatSelection';
import BookingReview from '@/components/flights/BookingReview';
import { useNotificationContext } from '@/context/useNotificationContext';

/**
 * Flight Booking Page
 * Multi-step booking process
 */
const FlightBookingPage = () => {
  const router = useRouter();
  const { showSuccess, showError } = useNotificationContext();
  
  const {
    selectedFlight,
    confirmedFlight,
    isPriceConfirming,
    handleConfirmPrice,
    bookingStep,
    goToStep,
    travelers,
    updateTravelers,
    seatMaps,
    selectedSeats,
    isLoadingSeatMaps,
    loadSeatMaps,
    selectSeat,
    handleCreateBooking,
    bookingInProgress
  } = useFlightContext();

  const [passengerCounts, setPassengerCounts] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });

  // Redirect if no flight selected
  useEffect(() => {
    if (!selectedFlight) {
      router.push('/flights/search');
    }
  }, [selectedFlight, router]);

  // Confirm price on mount
  useEffect(() => {
    if (selectedFlight && !confirmedFlight && !isPriceConfirming) {
      handleConfirmPrice(selectedFlight).catch((error) => {
        showError('Failed to confirm flight price');
        router.push('/flights/search');
      });
    }
  }, [selectedFlight]);

  // Extract passenger counts from flight
  useEffect(() => {
    if (selectedFlight) {
      const counts = { adults: 0, children: 0, infants: 0 };
      
      selectedFlight.travelerPricings?.forEach((pricing) => {
        if (pricing.travelerType === 'ADULT') counts.adults++;
        else if (pricing.travelerType === 'CHILD') counts.children++;
        else if (pricing.travelerType === 'INFANT' || pricing.travelerType === 'SEATED_INFANT') counts.infants++;
      });

      setPassengerCounts(counts);
    }
  }, [selectedFlight]);

  // Load seat maps when reaching seat selection step
  useEffect(() => {
    if (bookingStep === 4 && confirmedFlight && seatMaps.length === 0 && !isLoadingSeatMaps) {
      loadSeatMaps(confirmedFlight);
    }
  }, [bookingStep, confirmedFlight]);

  if (!selectedFlight) {
    return null;
  }

  // Handle traveler form validation
  const handleTravelersValidated = (isValid) => {
    if (isValid) {
      goToStep(4); // Move to seat selection
    }
  };

  // Handle skip seat selection
  const handleSkipSeats = () => {
    goToStep(5); // Move to review
  };

  // Handle continue from seats
  const handleContinueFromSeats = () => {
    goToStep(5); // Move to review
  };

  // Handle booking confirmation
  const handleConfirmBooking = async (bookingData) => {
    try {
      await handleCreateBooking(bookingData);
      showSuccess('Flight booked successfully!');
      router.push('/flights/confirmation');
    } catch (error) {
      showError(error.message || 'Failed to create booking');
    }
  };

  // Render step indicator
  const renderStepIndicator = () => {
    const steps = [
      { num: 3, label: 'Travelers', icon: 'account-multiple' },
      { num: 4, label: 'Seats', icon: 'seat-passenger' },
      { num: 5, label: 'Review', icon: 'check-circle' }
    ];

    return (
      <div className="mb-4">
        <div className="d-flex justify-content-center">
          {steps.map((step, index) => (
            <div key={step.num} className="d-flex align-items-center">
              <div
                className={`d-flex flex-column align-items-center ${
                  bookingStep >= step.num ? 'text-primary' : 'text-muted'
                }`}
              >
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                    bookingStep >= step.num ? 'bg-primary text-white' : 'bg-light'
                  }`}
                  style={{ width: '50px', height: '50px' }}
                >
                  <i className={`mdi mdi-${step.icon}`} style={{ fontSize: '1.5rem' }}></i>
                </div>
                <span className="small fw-semibold">{step.label}</span>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={`mx-3 ${bookingStep > step.num ? 'border-primary' : 'border-secondary'}`}
                  style={{ width: '60px', borderTop: '2px solid', marginTop: '-20px' }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Flights', path: '/flights/search' },
          { label: 'Booking', path: '/flights/booking', active: true }
        ]}
        title="Complete Your Booking"
      />

      <div className="container-fluid">
        {isPriceConfirming && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Confirming price...</span>
            </div>
            <p className="mt-3 text-muted">Confirming flight availability and price...</p>
          </div>
        )}

        {!isPriceConfirming && confirmedFlight && (
          <>
            {/* Step Indicator */}
            {renderStepIndicator()}

            {/* Step Content */}
            <div className="row justify-content-center">
              <div className="col-lg-10">
                {bookingStep === 3 && (
                  <TravelerForm
                    travelers={travelers}
                    passengerCounts={passengerCounts}
                    onTravelersChange={updateTravelers}
                    onValidate={handleTravelersValidated}
                  />
                )}

                {bookingStep === 4 && (
                  <SeatSelection
                    seatMaps={seatMaps}
                    travelers={travelers}
                    selectedSeats={selectedSeats}
                    onSeatSelect={selectSeat}
                    onSkip={handleSkipSeats}
                    onContinue={handleContinueFromSeats}
                    isLoading={isLoadingSeatMaps}
                  />
                )}

                {bookingStep === 5 && (
                  <BookingReview
                    flight={confirmedFlight}
                    travelers={travelers}
                    selectedSeats={selectedSeats}
                    onConfirmBooking={handleConfirmBooking}
                    onBack={() => goToStep(4)}
                    isBooking={bookingInProgress}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FlightBookingPage;

