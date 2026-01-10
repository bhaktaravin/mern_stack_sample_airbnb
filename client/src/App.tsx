import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { listingsAPI, FilterParams, Listing, ListingsResponse } from './services/api';
import Filters from './components/Filters';
import ListingCard from './components/ListingCard';
import Pagination from './components/Pagination';
import ListingDetails from './components/ListingDetails';

function ListingsMain() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [currentFilters, setCurrentFilters] = useState<FilterParams>({
    page: 1,
    limit: 20
  });

  const fetchListings = async (filters: FilterParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ListingsResponse = await listingsAPI.getListings(filters);
      setListings(response.listings);
      setPaginationInfo({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage,
      });
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to fetch listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(currentFilters);
  }, [currentFilters]);

  const handleFilterChange = (filters: FilterParams) => {
    const newFilters = { ...filters, limit: currentFilters.limit };
    setCurrentFilters(newFilters);
    fetchListings(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...currentFilters, page };
    setCurrentFilters(newFilters);
    fetchListings(newFilters);
    
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigate = useNavigate();
  const handleListingClick = (listing: Listing) => {
    navigate(`/listing/${listing.slug}`);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🏠 Airbnb Clone</h1>
          <p>Discover amazing places to stay around the world</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <Filters onFilterChange={handleFilterChange} loading={loading} />

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => fetchListings(currentFilters)}>
                Try Again
              </button>
            </div>
          )}

          <div className="listings-section">
            <div className="listings-header">
              <h2>
                {loading ? (
                  'Loading listings...'
                ) : (
                  `${paginationInfo.total.toLocaleString()} stays found`
                )}
              </h2>
              {paginationInfo.total > 0 && !loading && (
                <p className="results-info">
                  Showing {((paginationInfo.page - 1) * paginationInfo.limit) + 1} - {Math.min(paginationInfo.page * paginationInfo.limit, paginationInfo.total)} of {paginationInfo.total.toLocaleString()} results
                </p>
              )}
            </div>

            {loading ? (
              <div className="loading-grid">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="listing-skeleton">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-content">
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line short"></div>
                      <div className="skeleton-line"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <>
                <div className="listings-grid">
                  {listings.map((listing) => (
                    <ListingCard
                      key={listing._id}
                      listing={listing}
                      onClick={handleListingClick}
                    />
                  ))}
                </div>
                
                <Pagination
                  currentPage={paginationInfo.page}
                  totalPages={paginationInfo.totalPages}
                  hasNextPage={paginationInfo.hasNextPage}
                  hasPrevPage={paginationInfo.hasPrevPage}
                  onPageChange={handlePageChange}
                  loading={loading}
                />
              </>
            ) : (
              <div className="no-results">
                <h3>No listings found</h3>
                <p>Try adjusting your search filters to find more results.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2025 Airbnb Clone. Built with React, Node.js, and MongoDB.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListingsMain />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
