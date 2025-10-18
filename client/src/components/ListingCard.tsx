import React from 'react';
import { Listing } from '../services/api';
import './ListingCard.css';

interface ListingCardProps {
  listing: Listing;
  onClick?: (listing: Listing) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(listing);
    }
  };

  const formatPrice = (price: any) => {
    if (price && price.$numberDecimal) {
      return `$${parseFloat(price.$numberDecimal).toFixed(0)}`;
    }
    return 'Price N/A';
  };

  const formatBathrooms = (bathrooms: any) => {
    if (bathrooms && bathrooms.$numberDecimal) {
      return parseFloat(bathrooms.$numberDecimal);
    }
    return bathrooms || 0;
  };

  return (
    <div className="listing-card" onClick={handleClick}>
      <div className="listing-image">
        <img 
          src={listing.images?.picture_url || '/placeholder-image.jpg'} 
          alt={listing.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-image.jpg';
          }}
        />
        {listing.host?.host_is_superhost && (
          <span className="superhost-badge">Superhost</span>
        )}
      </div>
      
      <div className="listing-info">
        <div className="listing-location">
          {listing.address?.country} • {listing.address?.market}
        </div>
        
        <h3 className="listing-name">{listing.name}</h3>
        
        <div className="listing-details">
          <span>{listing.property_type}</span> • 
          <span>{listing.room_type}</span> • 
          <span>{listing.accommodates} guests</span>
        </div>
        
        <div className="listing-amenities">
          {listing.bedrooms && <span>{listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}</span>}
          {listing.beds && <span> • {listing.beds} bed{listing.beds !== 1 ? 's' : ''}</span>}
          {formatBathrooms(listing.bathrooms) > 0 && (
            <span> • {formatBathrooms(listing.bathrooms)} bath{formatBathrooms(listing.bathrooms) !== 1 ? 's' : ''}</span>
          )}
        </div>
        
        <div className="listing-reviews">
          {listing.number_of_reviews > 0 ? (
            <span>★ ({listing.number_of_reviews} reviews)</span>
          ) : (
            <span>No reviews yet</span>
          )}
        </div>
        
        <div className="listing-price">
          <strong>{formatPrice(listing.price)} / night</strong>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;