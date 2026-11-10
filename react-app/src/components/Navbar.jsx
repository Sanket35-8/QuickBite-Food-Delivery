import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

/**
 * Navbar Component
 * Displays brand logo, navigation links, live cart badge, and user login/profile status.
 */
function Navbar({ cartCount, currentUser, onLogout }) {
  const navigate = useNavigate();

  const handleUserClick = (e) => {
    if (currentUser && currentUser.isLoggedIn) {
      e.preventDefault();
      if (window.confirm(`Do you want to log out, ${currentUser.name}?`)) {
        onLogout();
        navigate('/');
      }
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div class="announcement-bar" id="offers">
        <div class="container">
          ⚡ <strong>Special Launch Offer:</strong> Flat 50% OFF + Free Delivery on your first 3 orders! Use code: <span class="code-tag">QUICK50</span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header class="navbar">
        <div class="container nav-container">
          {/* Brand Logo */}
          <Link to="/" class="brand-logo" id="nav-brand-logo">
            <div class="logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4L19.29 11.29C19.68 11.68 19.68 12.32 19.29 12.71L12.71 19.29C12.32 19.68 11.68 19.68 11.29 19.29L4.71 12.71C4.32 12.32 4.32 11.68 4.71 11.29L12 4M12 6.5C10.62 6.5 9.5 7.62 9.5 9C9.5 10.05 10.15 10.95 11.08 11.32C11.03 11.53 11 11.76 11 12C11 12.55 11.45 13 12 13S13 12.55 13 12C13 11.76 12.97 11.53 12.92 11.32C13.85 10.95 14.5 10.05 14.5 9C14.5 7.62 13.38 6.5 12 6.5Z"/>
              </svg>
            </div>
            Quick<span class="highlight">Bite</span>
          </Link>

          {/* Navigation Links */}
          <nav class="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-link-home">
              Home
            </NavLink>
            <NavLink to="/restaurants" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-link-restaurants">
              Restaurants
            </NavLink>
            <NavLink to="/menu" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-link-menu">
              Menu
            </NavLink>
            <a href="/#offers" class="nav-link" id="nav-link-offers">
              Offers
            </a>
            <a href="/#contact" class="nav-link" id="nav-link-contact">
              Contact
            </a>
          </nav>

          {/* Nav Actions: Cart & Sign In */}
          <div class="nav-actions">
            <Link to="/cart" class="cart-nav-btn" id="nav-btn-cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>Cart</span>
              <span class="cart-count-badge" id="nav-cart-count">
                {cartCount}
              </span>
            </Link>

            {currentUser && currentUser.isLoggedIn ? (
              <button
                onClick={handleUserClick}
                class="btn btn-primary btn-sm"
                id="nav-btn-login"
                title="Click to Log Out"
                style={{ cursor: 'pointer' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ width: 16, height: 16 }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Hi, {currentUser.name.split(' ')[0]}
              </button>
            ) : (
              <Link to="/login" class="btn btn-primary btn-sm" id="nav-btn-login">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
