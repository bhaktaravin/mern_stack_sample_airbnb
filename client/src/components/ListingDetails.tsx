import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listingsAPI, Listing } from '../services/api';
import './ListingCard.css';

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const data = await listingsAPI.getListingBySlug(id);
          setListing(data);
        }
      } catch (err) {
        setError('Failed to fetch listing details.');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!listing) return <div>Listing not found.</div>;

  return (
    <div className="listing-details-container">
      <Link to="/">← Back to Listings</Link>
      <div className="listing-details-card">
        <img
          src={listing.images?.picture_url || '/placeholder-image.jpg'}
          alt={listing.name}
          className="listing-details-image"
        />
        <h2>{listing.name}</h2>
        <p><strong>Location:</strong> {listing.address?.country || 'Unknown'}</p>
        <p><strong>Price:</strong> {listing.price?.$numberDecimal ? `$${listing.price.$numberDecimal}` : 'N/A'}</p>
        <p><strong>Type:</strong> {listing.property_type}</p>
        <p><strong>Room Type:</strong> {listing.room_type}</p>
        <p><strong>Accommodates:</strong> {listing.accommodates}</p>
        <p><strong>Bedrooms:</strong> {listing.bedrooms}</p>
        <p><strong>Bathrooms:</strong> {listing.bathrooms?.$numberDecimal || listing.bathrooms || 'N/A'}</p>
        <p><strong>Description:</strong> {listing.description}</p>
        <p><strong>Amenities:</strong> {listing.amenities?.join(', ')}</p>
        <p><strong>Host:</strong> {listing.host?.host_name}</p>
        <img
          src={listing.host?.host_picture_url || '/placeholder-image.jpg'}
          alt={listing.host?.host_name}
          className="listing-details-host-image"
        />
      </div>
    </div>
  );
};

export default ListingDetails;
