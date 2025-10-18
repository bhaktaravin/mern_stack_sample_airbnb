import React, { useState, useEffect } from 'react';
import { FilterParams } from '../services/api';
import './Filters.css';

interface FiltersProps {
  onFilterChange: (filters: FilterParams) => void;
  loading?: boolean;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange, loading }) => {
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    property_type: '',
    room_type: '',
    country: '',
    min_price: undefined,
    max_price: undefined,
    accommodates: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const propertyTypes = [
    'Apartment', 'House', 'Condominium', 'Villa', 'Townhouse', 'Loft', 
    'Bed and breakfast', 'Boutique hotel', 'Hostel', 'Hotel'
  ];

  const roomTypes = [
    'Entire home/apt', 'Private room', 'Shared room', 'Hotel room'
  ];

  const popularCountries = [
    'United States', 'Spain', 'France', 'Italy', 'Portugal', 'Brazil', 
    'Australia', 'Canada', 'Germany', 'Hong Kong', 'Turkey', 'Greece'
  ];

  const handleInputChange = (key: keyof FilterParams, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    // Reset to page 1 when applying new filters
    const searchFilters = { ...filters, page: 1 };
    onFilterChange(searchFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterParams = {
      search: '',
      property_type: '',
      room_type: '',
      country: '',
      min_price: undefined,
      max_price: undefined,
      accommodates: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
    };
    setFilters(clearedFilters);
    onFilterChange({ page: 1 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h2>Find Your Perfect Stay</h2>
        <button 
          className="advanced-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </button>
      </div>

      {/* Search Bar */}
      <div className="filter-row">
        <div className="filter-group full-width">
          <input
            type="text"
            placeholder="Search by name, location, or description..."
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
        </div>
      </div>

      {/* Basic Filters */}
      <div className="filter-row">
        <div className="filter-group">
          <label>Property Type</label>
          <select
            value={filters.property_type || ''}
            onChange={(e) => handleInputChange('property_type', e.target.value)}
          >
            <option value="">Any Property Type</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Room Type</label>
          <select
            value={filters.room_type || ''}
            onChange={(e) => handleInputChange('room_type', e.target.value)}
          >
            <option value="">Any Room Type</option>
            {roomTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Country</label>
          <select
            value={filters.country || ''}
            onChange={(e) => handleInputChange('country', e.target.value)}
          >
            <option value="">Any Country</option>
            {popularCountries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="advanced-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Min Price ($)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.min_price || ''}
                onChange={(e) => handleInputChange('min_price', e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>

            <div className="filter-group">
              <label>Max Price ($)</label>
              <input
                type="number"
                placeholder="1000"
                value={filters.max_price || ''}
                onChange={(e) => handleInputChange('max_price', e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>

            <div className="filter-group">
              <label>Guests</label>
              <select
                value={filters.accommodates || ''}
                onChange={(e) => handleInputChange('accommodates', e.target.value ? parseInt(e.target.value) : undefined)}
              >
                <option value="">Any</option>
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <option key={num} value={num}>{num}+ guests</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Bedrooms</label>
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => handleInputChange('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
              >
                <option value="">Any</option>
                {[1,2,3,4,5].map(num => (
                  <option key={num} value={num}>{num}+ bedrooms</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Bathrooms</label>
              <select
                value={filters.bathrooms || ''}
                onChange={(e) => handleInputChange('bathrooms', e.target.value ? parseFloat(e.target.value) : undefined)}
              >
                <option value="">Any</option>
                {[1, 1.5, 2, 2.5, 3, 3.5, 4].map(num => (
                  <option key={num} value={num}>{num}+ bathrooms</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="filter-actions">
        <button 
          className="search-button" 
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button 
          className="clear-button" 
          onClick={handleClearFilters}
          disabled={loading}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default Filters;