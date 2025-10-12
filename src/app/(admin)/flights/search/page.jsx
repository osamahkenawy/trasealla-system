'use client';

import { useFlightContext } from '@/context/useFlightContext';
import FlightSearchForm from '@/components/flights/FlightSearchForm';
import FlightResultsList from '@/components/flights/FlightResultsList';
import PageTitle from '@/components/PageTitle';
import { useRouter } from 'next/navigation';

/**
 * Flight Search Page
 * Main page for searching and selecting flights
 */
const FlightSearchPage = () => {
  const router = useRouter();
  const {
    searchParams,
    searchResults,
    filteredResults,
    isSearching,
    searchError,
    filters,
    sortBy,
    updateFilters,
    clearFilters,
    setSortBy,
    handleSearchFlights,
    selectFlight
  } = useFlightContext();

  const handleSearch = async (params) => {
    try {
      await handleSearchFlights(params);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSelectFlight = async (flight) => {
    await selectFlight(flight);
    router.push('/flights/booking');
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Flights', path: '/flights/search', active: true }
        ]}
        title="Search Flights"
      />

      <div className="container-fluid">
        {/* Search Form */}
        <FlightSearchForm
          onSearch={handleSearch}
          isSearching={isSearching}
          initialValues={searchParams}
        />

        {/* Error Message */}
        {searchError && (
          <div className="alert alert-danger mt-4" role="alert">
            <i className="mdi mdi-alert-circle me-2"></i>
            {searchError}
          </div>
        )}

        {/* Results */}
        {(searchResults.length > 0 || isSearching) && (
          <FlightResultsList
            flights={filteredResults}
            filters={filters}
            sortBy={sortBy}
            onFilterChange={updateFilters}
            onSortChange={setSortBy}
            onClearFilters={clearFilters}
            onSelectFlight={handleSelectFlight}
            isLoading={isSearching}
          />
        )}
      </div>
    </>
  );
};

export default FlightSearchPage;

