import React from 'react';
import { Link } from 'react-router-dom';

/**
 * RestaurantCard Component
 * Reusable component for displaying restaurant details, ratings, cuisine tags, delivery time, and "View Menu" action.
 */
function RestaurantCard({ restaurant, onBookmark }) {
  const isBookmarked = false;

  return (
    <div className="restaurant-card">
      {/* Restaurant Image / Illustration Box */}
      <div className="restaurant-img-box" style={{ background: restaurant.bgColor || '#FEF3C7' }}>
        <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <rect width="400" height="240" fill={restaurant.bgColor || '#FEF3C7'} />
          <circle cx="200" cy="120" r="75" fill={restaurant.accentColor || '#D97706'} opacity="0.85" />
          <circle cx="200" cy="120" r="60" fill="#FFFBEB" opacity="0.95" />
          <circle cx="170" cy="115" r="14" fill={restaurant.accentColor || '#D97706'} />
          <circle cx="230" cy="125" r="16" fill={restaurant.accentColor || '#D97706'} />
          <path d="M165 105 Q200 85 235 105" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
        </svg>

        {/* Promo / Discount Badge */}
        {restaurant.offer && (
          <div className="restaurant-promos">
            <span className={`badge ${restaurant.isVeg ? 'badge-offer-tag' : 'badge-discount'}`}>
              {restaurant.offer}
            </span>
          </div>
        )}

        {/* Bookmark Button */}
        <button
          className="restaurant-bookmark-btn"
          aria-label="Save Restaurant"
          onClick={(e) => {
            e.preventDefault();
            if (onBookmark) onBookmark(restaurant);
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      {/* Restaurant Info */}
      <div className="restaurant-info">
        <div className="restaurant-header-row">
          <h3 className="restaurant-name">{restaurant.name}</h3>
          <span className="badge-rating">
            <svg viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {restaurant.rating}
          </span>
        </div>

        <p className="restaurant-cuisines">{restaurant.cuisine}</p>

        <div className="restaurant-meta-row">
          <div className="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {restaurant.deliveryTime}
          </div>
          <div className="meta-item">₹{restaurant.costForTwo} for two</div>
          <div className="meta-item">
            <span className={`food-type-icon ${restaurant.isVeg ? 'veg' : 'non-veg'}`}></span>
            {restaurant.isVeg ? 'Pure Veg' : 'Non-Veg'}
          </div>
        </div>

        <div className="restaurant-action-row">
          <Link to={`/menu?id=${restaurant.id}`} className="btn btn-outline btn-block btn-sm">
            View Menu & Order
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
