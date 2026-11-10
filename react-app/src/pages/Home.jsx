import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import FoodCard from '../components/FoodCard';
import { RESTAURANTS, CATEGORIES, FEATURED_DISHES } from '../data/mockData';

/**
 * Home Page (/)
 * Main landing page with hero banner, live search, categories grid, featured food items, top-rated restaurants, and promotional offers.
 */
function Home({ onAddToCart, onBookmark }) {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('delhi');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/restaurants');
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/restaurants?search=${encodeURIComponent(tag)}`);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/restaurants?category=${encodeURIComponent(categoryName)}`);
  };

  // Filter featured dishes and restaurants if user types in search
  const filteredDishes = searchQuery
    ? FEATURED_DISHES.filter(
        (dish) =>
          dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dish.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dish.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : FEATURED_DISHES;

  const filteredRestaurants = searchQuery
    ? RESTAURANTS.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : RESTAURANTS.slice(0, 6);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="pulse-dot"></span>
                Superfast 30-Minute Food Delivery
              </div>
              <h1 className="hero-title">
                Delicious food, <br />
                <span className="gradient-text">delivered to your door</span>
              </h1>
              <p className="hero-description">
                Craving rich Awadhi Biryani, sizzling Paneer Tikka, or crispy Mysore Masala Dosa? Discover top-rated authentic local restaurants with seamless ordering and live tracking.
              </p>

              {/* Search Bar with Location */}
              <form className="hero-search-box" onSubmit={handleSearchSubmit}>
                <select
                  className="search-location-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  aria-label="Select City or Area"
                >
                  <option value="delhi">📍 Connaught Place, New Delhi</option>
                  <option value="mumbai">📍 Bandra West, Mumbai</option>
                  <option value="bangalore">📍 Indiranagar, Bengaluru</option>
                  <option value="hyderabad">📍 Jubilee Hills, Hyderabad</option>
                  <option value="pune">📍 Koregaon Park, Pune</option>
                </select>

                <div className="search-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search for biryani, butter chicken, thali, or sweets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" id="hero-explore-btn">
                  Explore Food
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </form>

              {/* Quick Search Tags */}
              <div className="quick-tags">
                <span className="quick-tags-label">Popular Searches:</span>
                {['Dum Biryani', 'Butter Chicken', 'Paneer Tikka', 'Masala Dosa', 'Momos', 'Gulab Jamun'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="tag-pill"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Hero Stats */}
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Partner Kitchens</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">28 Mins</span>
                  <span className="stat-label">Avg. Delivery</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">4.8 ★</span>
                  <span className="stat-label">App Rating</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100k+</span>
                  <span className="stat-label">Happy Foodies</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Graphic Collage */}
            <div className="hero-visual">
              <div className="floating-badge badge-top-right">
                <div className="float-icon delivery">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="float-text">
                  <h4>Express Delivery</h4>
                  <p>Under 30 Minutes Guaranteed</p>
                </div>
              </div>

              <div className="hero-main-card">
                <div className="hero-image-wrap">
                  <svg className="hero-food-svg" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-lg)' }}>
                    <rect width="400" height="300" rx="20" fill="#FFF7ED" />
                    <circle cx="200" cy="150" r="110" fill="#EA580C" opacity="0.1" />
                    <circle cx="200" cy="150" r="95" fill="#FF5722" />
                    <ellipse cx="200" cy="150" rx="75" ry="45" fill="#FEF3C7" />
                    <circle cx="165" cy="145" r="12" fill="#92400E" />
                    <circle cx="235" cy="155" r="14" fill="#78350F" />
                    <circle cx="200" cy="160" r="11" fill="#92400E" />
                    <path d="M175 130 Q200 115 225 130" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="hero-card-footer">
                  <div>
                    <h4>Royal Awadh Dum Biryani</h4>
                    <p>⭐ 4.9 • 25 mins • Connaught Place</p>
                  </div>
                  <Link to="/menu?id=1" className="btn btn-primary btn-sm">
                    Order Now
                  </Link>
                </div>
              </div>

              <div className="floating-badge badge-bottom-left">
                <div className="float-icon offers">🏷️</div>
                <div className="float-text">
                  <h4>50% OFF Applied</h4>
                  <p>Coupon: QUICK50</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOOD CATEGORIES SECTION */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <div>
              <span className="section-tag">Popular Categories</span>
              <h2 className="section-heading">What are you craving today?</h2>
              <p className="section-subtitle">Explore a rich collection of authentic regional Indian delicacies prepared by master chefs.</p>
            </div>
            <Link to="/restaurants" className="view-all-link">
              View All Categories
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>

          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="category-card"
                onClick={() => handleCategoryClick(cat.name)}
                style={{ cursor: 'pointer' }}
              >
                <div className="category-img-box" style={{ background: cat.bgColor }}>
                  <span style={{ fontSize: '2.5rem' }}>{cat.emoji}</span>
                </div>
                <h4 className="category-name">{cat.name}</h4>
                <p className="category-count">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED DISHES SECTION */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-title-wrap">
            <div>
              <span className="section-tag">Chef's Recommendations</span>
              <h2 className="section-heading">Featured Dishes</h2>
              <p className="section-subtitle">Handpicked culinary masterpieces loved and ordered by thousands of customers daily.</p>
            </div>
            <Link to="/menu" className="view-all-link">
              View Full Menu
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>

          <div className="dishes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {filteredDishes.map((dish) => (
              <FoodCard key={dish.id} item={dish} onAddToCart={onAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. TOP RESTAURANTS SECTION */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <div>
              <span className="section-tag">Partner Kitchens</span>
              <h2 className="section-heading">Top Rated Restaurants</h2>
              <p className="section-subtitle">Order from certified hygienic kitchens delivering fresh, piping hot meals right to your doorstep.</p>
            </div>
            <Link to="/restaurants" className="view-all-link">
              Browse All 52 Kitchens
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>

          <div className="restaurants-grid">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} onBookmark={onBookmark} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROMO / OFFERS BANNER */}
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="container">
          <div className="promo-banner">
            <div className="promo-grid">
              <div className="promo-content">
                <span className="badge badge-discount" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
                  LIMITED TIME OFFER
                </span>
                <h2>Get 50% OFF On Your First 3 Orders!</h2>
                <p>
                  Experience the convenience of QuickBite. Use coupon code <strong style={{ color: 'var(--accent-gold)' }}>QUICK50</strong> at checkout and enjoy zero delivery charges.
                </p>
                <div className="promo-actions">
                  <Link to="/restaurants" className="btn btn-primary btn-lg">
                    Order Now & Save 50%
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
