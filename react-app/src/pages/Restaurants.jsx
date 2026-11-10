import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import { RESTAURANTS } from '../data/mockData';

/**
 * Restaurants Page (/restaurants)
 * Complete restaurant browsing experience with multi-criteria filtering, live search, sorting, and dietary filters.
 */
function Restaurants({ onBookmark }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';

  // Local state for search & filters
  const [searchTerm, setSearchTerm] = useState(urlSearch || urlCategory || '');
  const [activePill, setActivePill] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [priceRange, setPriceRange] = useState({ under250: false, mid: false, above500: false });

  // Sync with URL query parameters
  useEffect(() => {
    if (urlSearch) {
      setSearchTerm(urlSearch);
    } else if (urlCategory) {
      setSearchTerm(urlCategory);
    }
  }, [urlSearch, urlCategory]);

  const handlePillClick = (pillKey) => {
    setActivePill(pillKey);
  };

  const handleCuisineToggle = (cuisineKey) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisineKey) ? prev.filter((c) => c !== cuisineKey) : [...prev, cuisineKey]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setActivePill('all');
    setSortBy('relevance');
    setVegOnly(false);
    setSelectedCuisines([]);
    setPriceRange({ under250: false, mid: false, above500: false });
    setSearchParams({});
  };

  // Filter and Sort logic
  const filteredRestaurants = useMemo(() => {
    let result = [...RESTAURANTS];

    // 1. Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          (r.category && r.category.toLowerCase().includes(q))
      );
    }

    // 2. Pill filters
    if (activePill === 'veg') {
      result = result.filter((r) => r.isVeg);
    } else if (activePill === 'rating') {
      result = result.filter((r) => r.rating >= 4.0);
    } else if (activePill === 'fast') {
      result = result.filter((r) => {
        const mins = parseInt(r.deliveryTime.split('-')[0], 10);
        return mins <= 25;
      });
    } else if (activePill === 'offers') {
      result = result.filter((r) => r.offer && r.offer.length > 0);
    } else if (activePill === 'budget') {
      result = result.filter((r) => r.costForTwo <= 300);
    }

    // 3. Sidebar Dietary checkbox
    if (vegOnly) {
      result = result.filter((r) => r.isVeg);
    }

    // 4. Sidebar Cuisines checkboxes
    if (selectedCuisines.length > 0) {
      result = result.filter((r) => {
        const cLower = r.cuisine.toLowerCase();
        return selectedCuisines.some((c) => cLower.includes(c));
      });
    }

    // 5. Sidebar Price Range
    const anyPriceSelected = priceRange.under250 || priceRange.mid || priceRange.above500;
    if (anyPriceSelected) {
      result = result.filter((r) => {
        if (priceRange.under250 && r.costForTwo < 250) return true;
        if (priceRange.mid && r.costForTwo >= 250 && r.costForTwo <= 500) return true;
        if (priceRange.above500 && r.costForTwo > 500) return true;
        return false;
      });
    }

    // 6. Sorting
    if (sortBy === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'cost-asc') {
      result.sort((a, b) => a.costForTwo - b.costForTwo);
    } else if (sortBy === 'cost-desc') {
      result.sort((a, b) => b.costForTwo - a.costForTwo);
    } else if (sortBy === 'delivery') {
      result.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
    }

    return result;
  }, [searchTerm, activePill, sortBy, vegOnly, selectedCuisines, priceRange]);

  return (
    <div>
      {/* Breadcrumb Bar */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--gray-200)' }}>
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Restaurants in New Delhi</span>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <main className="section">
        <div className="container">
          {/* Header & Title */}
          <div className="section-title-wrap">
            <div>
              <h1 className="section-heading">All Restaurants in New Delhi</h1>
              <p className="section-subtitle">
                Showing {filteredRestaurants.length} delicious kitchen{filteredRestaurants.length !== 1 ? 's' : ''} delivering fresh meals to your location.
              </p>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="filter-pills-row">
            <button
              className={`filter-pill-btn ${activePill === 'all' ? 'active' : ''}`}
              onClick={() => handlePillClick('all')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              All ({RESTAURANTS.length})
            </button>
            <button
              className={`filter-pill-btn ${activePill === 'veg' ? 'active' : ''}`}
              onClick={() => handlePillClick(activePill === 'veg' ? 'all' : 'veg')}
            >
              <span className="food-type-icon veg"></span> Pure Veg
            </button>
            <button
              className={`filter-pill-btn ${activePill === 'rating' ? 'active' : ''}`}
              onClick={() => handlePillClick(activePill === 'rating' ? 'all' : 'rating')}
            >
              ★ Rating 4.0+
            </button>
            <button
              className={`filter-pill-btn ${activePill === 'fast' ? 'active' : ''}`}
              onClick={() => handlePillClick(activePill === 'fast' ? 'all' : 'fast')}
            >
              ⚡ Fast Delivery (&lt;30 mins)
            </button>
            <button
              className={`filter-pill-btn ${activePill === 'offers' ? 'active' : ''}`}
              onClick={() => handlePillClick(activePill === 'offers' ? 'all' : 'offers')}
            >
              🏷️ Great Offers
            </button>
            <button
              className={`filter-pill-btn ${activePill === 'budget' ? 'active' : ''}`}
              onClick={() => handlePillClick(activePill === 'budget' ? 'all' : 'budget')}
            >
              💰 Less than ₹300
            </button>
          </div>

          {/* 2-Column Layout */}
          <div className="filter-layout">
            {/* Left Sidebar: Filters */}
            <aside className="filter-sidebar">
              <div className="filter-sidebar-header">
                <h3>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  Filters
                </h3>
                <button className="clear-filter-btn" onClick={handleResetFilters}>
                  Reset All
                </button>
              </div>

              {/* Sort Options */}
              <div className="filter-group">
                <div className="filter-group-title">Sort By</div>
                <label className="filter-option-label">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === 'relevance'}
                    onChange={() => setSortBy('relevance')}
                  />
                  <span>Relevance (Default)</span>
                </label>
                <label className="filter-option-label">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === 'rating-desc'}
                    onChange={() => setSortBy('rating-desc')}
                  />
                  <span>Rating: High to Low</span>
                </label>
                <label className="filter-option-label">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === 'delivery'}
                    onChange={() => setSortBy('delivery')}
                  />
                  <span>Delivery Time</span>
                </label>
                <label className="filter-option-label">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === 'cost-asc'}
                    onChange={() => setSortBy('cost-asc')}
                  />
                  <span>Cost: Low to High</span>
                </label>
                <label className="filter-option-label">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === 'cost-desc'}
                    onChange={() => setSortBy('cost-desc')}
                  />
                  <span>Cost: High to Low</span>
                </label>
              </div>

              {/* Dietary Preference */}
              <div className="filter-group">
                <div className="filter-group-title">Dietary Preference</div>
                <label className="filter-option-label">
                  <input
                    type="checkbox"
                    checked={vegOnly}
                    onChange={(e) => setVegOnly(e.target.checked)}
                  />
                  <span>Pure Veg Only</span>
                </label>
              </div>

              {/* Cuisines */}
              <div className="filter-group">
                <div className="filter-group-title">Cuisines</div>
                {[
                  { key: 'biryani', label: 'Biryani & Awadhi' },
                  { key: 'north indian', label: 'North Indian & Tandoor' },
                  { key: 'dosa', label: 'South Indian & Dosa' },
                  { key: 'chaat', label: 'Street Food & Chaat' },
                  { key: 'roll', label: 'Rolls & Momos' },
                  { key: 'curry', label: 'Coastal Seafood' },
                  { key: 'mithai', label: 'Mithai & Desserts' }
                ].map((c) => (
                  <label key={c.key} className="filter-option-label">
                    <input
                      type="checkbox"
                      checked={selectedCuisines.includes(c.key)}
                      onChange={() => handleCuisineToggle(c.key)}
                    />
                    <span>{c.label}</span>
                  </label>
                ))}
              </div>

              {/* Cost for Two */}
              <div className="filter-group">
                <div className="filter-group-title">Cost for Two</div>
                <label className="filter-option-label">
                  <input
                    type="checkbox"
                    checked={priceRange.under250}
                    onChange={(e) => setPriceRange({ ...priceRange, under250: e.target.checked })}
                  />
                  <span>Less than ₹250</span>
                </label>
                <label className="filter-option-label">
                  <input
                    type="checkbox"
                    checked={priceRange.mid}
                    onChange={(e) => setPriceRange({ ...priceRange, mid: e.target.checked })}
                  />
                  <span>₹250 - ₹500</span>
                </label>
                <label className="filter-option-label">
                  <input
                    type="checkbox"
                    checked={priceRange.above500}
                    onChange={(e) => setPriceRange({ ...priceRange, above500: e.target.checked })}
                  />
                  <span>₹500 and above</span>
                </label>
              </div>
            </aside>

            {/* Right Side: Search Input + Restaurant Grid */}
            <section className="restaurants-content">
              {/* Interactive Live Search Input */}
              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div
                  className="search-input-wrap"
                  style={{
                    flex: 1,
                    background: 'var(--white)',
                    border: '1.5px solid var(--gray-300)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.6rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ color: 'var(--gray-400)', flexShrink: 0 }}
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search restaurants or cuisines (e.g., Biryani, Dosa, Momos, Pizza)..."
                    style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.95rem', background: 'transparent', color: 'var(--dark-900)' }}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      style={{ border: 'none', background: 'transparent', color: 'var(--gray-400)', cursor: 'pointer', fontSize: '1.2rem' }}
                      title="Clear search"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {/* Restaurant Cards Grid or No Results Box */}
              {filteredRestaurants.length > 0 ? (
                <div className="restaurants-grid">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} onBookmark={onBookmark} />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    background: 'var(--white)',
                    border: '2px dashed var(--gray-300)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    margin: '1.5rem 0',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔍</div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--dark-900)', marginBottom: '0.5rem' }}>
                    No restaurants found
                  </h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                    We couldn't find any matches for "<strong>{searchTerm || 'selected filters'}</strong>". Try checking for typos or explore other categories.
                  </p>
                  <button className="btn btn-primary btn-sm" onClick={handleResetFilters}>
                    View All Restaurants
                  </button>
                </div>
              )}

              {/* Pagination */}
              <div className="pagination" style={{ marginTop: '2.5rem' }}>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Restaurants;
