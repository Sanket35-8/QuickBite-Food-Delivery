import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer Component
 * Multi-column footer with brand overview, quick navigation links, cuisines, contact info and student project credit.
 */
function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <Link to="/" className="brand-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4L19.29 11.29C19.68 11.68 19.68 12.32 19.29 12.71L12.71 19.29C12.32 19.68 11.68 19.68 11.29 19.29L4.71 12.71C4.32 12.32 4.32 11.68 4.71 11.29L12 4M12 6.5C10.62 6.5 9.5 7.62 9.5 9C9.5 10.05 10.15 10.95 11.08 11.32C11.03 11.53 11 11.76 11 12C11 12.55 11.45 13 12 13S13 12.55 13 12C13 11.76 12.97 11.53 12.92 11.32C13.85 10.95 14.5 10.05 14.5 9C14.5 7.62 13.38 6.5 12 6.5Z"/>
                </svg>
              </div>
              Quick<span className="highlight">Bite</span>
            </Link>
            <p>
              QuickBite is an original food delivery platform connecting food lovers with the most authentic local restaurants, kitchens, and sweet shops.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li><Link to="/" className="footer-link">Home Page</Link></li>
              <li><Link to="/restaurants" className="footer-link">Browse Restaurants</Link></li>
              <li><Link to="/menu" className="footer-link">Featured Menu</Link></li>
              <li><Link to="/cart" className="footer-link">View Cart & Checkout</Link></li>
              <li><Link to="/login" className="footer-link">Sign In / Register</Link></li>
            </ul>
          </div>

          {/* Popular Cuisines */}
          <div>
            <h4 className="footer-col-title">Popular Cuisines</h4>
            <ul className="footer-links-list">
              <li><Link to="/restaurants?search=Biryani" className="footer-link">Dum Biryanis</Link></li>
              <li><Link to="/restaurants?search=North%20Indian" className="footer-link">North Indian Gravies</Link></li>
              <li><Link to="/restaurants?search=South%20Indian" className="footer-link">South Indian Tiffins</Link></li>
              <li><Link to="/restaurants?search=Mughlai" className="footer-link">Mughlai & Kebabs</Link></li>
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h4 className="footer-col-title">Contact & Help</h4>
            <div className="footer-contact-info">
              <div className="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>QuickBite HQ, Connaught Place, New Delhi - 110001</span>
              </div>
              <div className="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>support@quickbite.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div>&copy; 2026 QuickBite Food Delivery Inc. All rights reserved.</div>
          <div className="footer-student-credit">Designed & Built for College Full-Stack Web Development Project</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
