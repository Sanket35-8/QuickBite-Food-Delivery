import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import { RESTAURANTS, MENU_ITEMS, MENU_CATEGORIES } from '../data/mockData';

/**
 * Menu Page (/menu)
 * Displays a restaurant's header, cuisine badges, discount carousel, sticky category sidebar, categorized dishes, and a floating checkout mini-bar.
 */
function Menu({ onAddToCart, cart, cartCount, cartTotal }) {
  const [searchParams] = useSearchParams();
  const restaurantId = parseInt(searchParams.get('id'), 10) || 1;

  // Find restaurant or fallback to Royal Awadh Biryani
  const restaurant = RESTAURANTS.find((r) => r.id === restaurantId) || RESTAURANTS[0];

  const [activeCategory, setActiveCategory] = useState('bestsellers');

  const scrollToCategory = (catId) => {
    setActiveCategory(catId);
    const elem = document.getElementById(catId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Breadcrumb Bar */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--gray-200)' }}>
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/restaurants">Restaurants</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{restaurant.name}</span>
          </div>
        </div>
      </div>

      <main className="section">
        <div className="container">
          {/* Restaurant Hero Header Box */}
          <div className="restaurant-hero-header">
            <div className="rest-header-top">
              <div className="rest-title-area">
                <h1>{restaurant.name}</h1>
                <p className="rest-cuisines-lg">{restaurant.cuisine}</p>
                <div className="rest-address-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{restaurant.address} • {restaurant.distance}</span>
                </div>
              </div>
              <div>
                <span className="badge-rating" style={{ fontSize: '1.1rem', padding: '0.5rem 0.9rem' }}>
                  <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {restaurant.rating}
                </span>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', textAlign: 'right', marginTop: '0.25rem' }}>
                  {restaurant.reviewsCount || '1,240'}+ ratings
                </div>
              </div>
            </div>

            <div className="rest-badges-row">
              <div className="rest-badge-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{restaurant.deliveryTime} Delivery</span>
              </div>
              <div className="rest-badge-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <span>₹{restaurant.costForTwo} for two</span>
              </div>
              <div className="rest-badge-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>FSSAI License: #{restaurant.fssai}</span>
              </div>
            </div>

            {/* Mini Offers Promo Carousel */}
            <div className="rest-offers-carousel">
              <div className="mini-offer-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                </svg>
                <div className="mini-offer-text">
                  <h5>50% OFF UPTO ₹100</h5>
                  <p>Use code <strong>ROYAL50</strong> | Min order ₹249</p>
                </div>
              </div>
              <div className="mini-offer-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                <div className="mini-offer-text">
                  <h5>FLAT ₹75 CASHBACK</h5>
                  <p>On all UPI payments through Paytm/GPay</p>
                </div>
              </div>
              <div className="mini-offer-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <div className="mini-offer-text">
                  <h5>FREE DELIVERY</h5>
                  <p>Applicable on all orders above ₹299</p>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Layout: Category Sidebar + Dish Sections */}
          <div className="menu-layout">
            {/* Sticky Sidebar Navigation */}
            <aside className="menu-category-nav">
              <h4>Menu Categories</h4>
              {MENU_CATEGORIES.map((cat) => {
                const count = MENU_ITEMS.filter((item) => item.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    className={`menu-nav-item ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => scrollToCategory(cat.id)}
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <span>{cat.name}</span>
                    <span>({count})</span>
                  </button>
                );
              })}
            </aside>

            {/* Right Side: Menu Item Blocks */}
            <section className="menu-content-area">
              {MENU_CATEGORIES.map((cat) => {
                const categoryItems = MENU_ITEMS.filter((item) => item.category === cat.id);
                if (categoryItems.length === 0) return null;

                return (
                  <div className="menu-section-block" id={cat.id} key={cat.id}>
                    <div className="menu-block-header">
                      <span>{cat.name}</span>
                      <span className="menu-block-count">{categoryItems.length} Items</span>
                    </div>

                    <div className="menu-items-list">
                      {categoryItems.map((dish) => (
                        <FoodCard
                          key={dish.id}
                          item={{ ...dish, restaurant: restaurant.name }}
                          onAddToCart={onAddToCart}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          </div>
        </div>
      </main>

      {/* Floating Mini-Cart Bar (Appears when cart has items) */}
      {cartCount > 0 && (
        <div className="floating-cart-bar" style={{ display: 'block' }}>
          <div className="floating-cart-inner">
            <div className="floating-cart-info">
              <div className="floating-cart-count">
                <span>🛒 {cartCount} Item{cartCount > 1 ? 's' : ''} in Cart</span>
              </div>
              <div className="floating-cart-price">
                Total: ₹{cartTotal.toFixed(2)}
              </div>
            </div>
            <Link to="/cart" className="btn btn-primary" id="floating-view-cart-btn">
              View Cart & Checkout
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;
