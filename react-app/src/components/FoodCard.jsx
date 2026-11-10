import React from 'react';

/**
 * FoodCard Component
 * Reusable card for dishes on Home and Menu pages, with Veg/Non-Veg indicators and Add to Cart action.
 */
function FoodCard({ item, onAddToCart }) {
  return (
    <div className="dish-card menu-item-card">
      <div className="menu-item-info">
        <div className="menu-item-header">
          <span className={`food-type-icon ${item.isVeg ? 'veg' : 'non-veg'}`}></span>
          {item.tag && (
            <span className="bestseller-tag">{item.tag}</span>
          )}
        </div>

        <h3 className="menu-item-name dish-title">{item.name}</h3>

        {item.restaurant && (
          <div className="dish-restaurant-name" style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '0.35rem' }}>
            By {item.restaurant}
          </div>
        )}

        <div className="menu-item-price-row">
          <span className="menu-item-price dish-price">₹{item.price}</span>
          {item.originalPrice && (
            <span style={{ color: 'var(--gray-400)', textDecoration: 'line-through', fontSize: '0.85rem' }}>
              ₹{item.originalPrice}
            </span>
          )}
        </div>

        {item.rating && (
          <div className="menu-item-rating-row">
            <span className="badge-rating" style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem' }}>
              ★ {item.rating}
            </span>
            {item.reviews && <span>({item.reviews} reviews)</span>}
          </div>
        )}

        <p className="menu-item-desc">
          {item.description || item.subtitle}
        </p>
      </div>

      {/* Item Image / Graphic & Add Button */}
      <div className="menu-item-img-box">
        <svg viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <rect width="140" height="120" fill={item.isVeg ? '#DCFCE7' : '#FEF3C7'} />
          <circle cx="70" cy="60" r="42" fill={item.isVeg ? '#16A34A' : '#D97706'} opacity="0.85" />
          <circle cx="70" cy="58" r="34" fill="#FFFBEB" opacity="0.9" />
          <circle cx="62" cy="54" r="6" fill={item.isVeg ? '#15803D' : '#78350F'} />
          <circle cx="78" cy="58" r="6" fill={item.isVeg ? '#15803D' : '#78350F'} />
        </svg>

        <button
          className="menu-item-add-btn"
          onClick={(e) => {
            e.preventDefault();
            onAddToCart(item);
          }}
          aria-label={`Add ${item.name} to cart`}
        >
          ADD +
        </button>
      </div>
    </div>
  );
}

export default FoodCard;
