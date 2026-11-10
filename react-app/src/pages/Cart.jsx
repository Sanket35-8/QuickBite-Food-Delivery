import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { COUPONS, DEFAULT_ADDRESSES } from '../data/mockData';

/**
 * Cart Page (/cart)
 * Complete shopping cart calculation engine with live quantity updates, coupon application, address selection, tips, and checkout.
 */
function Cart({ cart, onUpdateQuantity, onRemoveFromCart, onClearCart, onCheckoutSuccess, showToast }) {
  const [fulfillmentOption, setFulfillmentOption] = useState('delivery'); // 'delivery' | 'pickup' | 'dinein'
  const [selectedAddressId, setSelectedAddressId] = useState('home');
  const [selectedTip, setSelectedTip] = useState(0);
  const [couponCode, setCouponCode] = useState('QUICK50');
  const [appliedCoupon, setAppliedCoupon] = useState({
    code: 'QUICK50',
    discountPercent: 50,
    maxDiscount: 100,
    minOrder: 249,
    isApplied: true
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Calculations
  const itemTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Delivery fee based on fulfillment option:
  // (1) Delivery by QuickBite -> ₹40 fee
  // (2) Self Pickup / Takeaway -> ₹0 fee
  // (3) Dine-in -> ₹0 fee
  const deliveryFee = itemTotal === 0 ? 0 : fulfillmentOption === 'delivery' ? 40 : 0;
  const packagingFee = itemTotal === 0 ? 0 : 25;
  const taxes = +(itemTotal * 0.05).toFixed(2);
  const platformFee = itemTotal === 0 ? 0 : 5;

  // Selected Tip: only applicable for Delivery by QuickBite
  const effectiveTip = fulfillmentOption === 'delivery' ? selectedTip : 0;

  // Calculate coupon discount
  let discountAmount = 0;
  if (appliedCoupon && appliedCoupon.isApplied && itemTotal >= appliedCoupon.minOrder) {
    discountAmount = Math.min((itemTotal * (appliedCoupon.discountPercent / 100)), appliedCoupon.maxDiscount);
  }

  const grandTotal = Math.max(0, itemTotal + deliveryFee + packagingFee + taxes + platformFee + effectiveTip - discountAmount);

  // Apply coupon handler
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      if (showToast) showToast('Please enter a valid coupon code.', 'error');
      return;
    }

    if (COUPONS[code]) {
      const c = COUPONS[code];
      setAppliedCoupon({ ...c, isApplied: true });
      if (showToast) showToast(`Coupon "${code}" applied successfully! 🎉`, 'success');
    } else {
      if (showToast) showToast(`Coupon code "${code}" is invalid. Try "QUICK50".`, 'error');
    }
  };

  // Tip toggle handler
  const handleTipClick = (tipAmount) => {
    setSelectedTip((prev) => (prev === tipAmount ? 0 : tipAmount));
  };

  // Proceed to pay
  const handleProceedToPay = () => {
    if (cart.length === 0) {
      if (showToast) showToast('Your cart is empty. Add food items before checkout.', 'error');
      return;
    }

    const orderId = 'QB-' + Math.floor(100000 + Math.random() * 900000);

    let fulfillmentTitle = 'Delivery by QuickBite';
    let fulfillmentLocation = '';
    let fulfillmentEstimate = '⚡ 25-30 Minutes (Doorstep Delivery)';
    let deliveryFeeCharged = '₹40.00';

    if (fulfillmentOption === 'delivery') {
      fulfillmentTitle = 'Delivery by QuickBite';
      const activeAddress = DEFAULT_ADDRESSES.find((a) => a.id === selectedAddressId) || DEFAULT_ADDRESSES[0];
      fulfillmentLocation = `${activeAddress.type}: ${activeAddress.address}`;
      fulfillmentEstimate = '⚡ 25-30 Minutes (Doorstep Delivery)';
      deliveryFeeCharged = '₹40.00';
    } else if (fulfillmentOption === 'pickup') {
      fulfillmentTitle = 'Self Pickup / Takeaway';
      fulfillmentLocation = 'Royal Awadh Biryani, Shop 14-15, Inner Circle, Connaught Place, New Delhi';
      fulfillmentEstimate = '⚡ Ready in 15-20 Minutes (Counter Collection)';
      deliveryFeeCharged = '₹0.00 (FREE)';
    } else if (fulfillmentOption === 'dinein') {
      fulfillmentTitle = 'Dine-in (Restaurant Table Service)';
      fulfillmentLocation = 'Royal Awadh Biryani, Connaught Place, New Delhi (Table Allocated on Arrival)';
      fulfillmentEstimate = '🍽️ Dine-in Table Service (Fresh from Kitchen)';
      deliveryFeeCharged = '₹0.00 (FREE)';
    }

    const orderDetails = {
      orderId,
      grandTotal: grandTotal.toFixed(2),
      fulfillmentTitle,
      fulfillmentLocation,
      fulfillmentEstimate,
      deliveryFeeCharged,
      selectedAddress: fulfillmentLocation,
      selectedPayment: paymentMethod.toUpperCase(),
      itemCount: totalCount
    };

    onCheckoutSuccess(orderDetails);
    onClearCart();
  };

  return (
    <div>
      {/* Breadcrumb Bar */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--gray-200)' }}>
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/menu">Royal Awadh Biryani</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Shopping Cart</span>
          </div>
        </div>
      </div>

      <main className="section">
        <div className="container">
          {/* Section Heading */}
          <div className="section-title-wrap">
            <div>
              <h1 className="section-heading">
                Your Food Cart ({totalCount} Item{totalCount !== 1 ? 's' : ''})
              </h1>
              <p className="section-subtitle">
                Review your selected items and choose your preferred delivery address.
              </p>
            </div>
          </div>

          {/* If cart is empty */}
          {cart.length === 0 ? (
            <div
              style={{
                background: 'var(--white)',
                borderRadius: 'var(--radius-xl)',
                padding: '4rem 2rem',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--gray-200)',
                maxWidth: 600,
                margin: '0 auto'
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--dark-900)', marginBottom: '0.5rem' }}>
                Your Cart is Empty
              </h3>
              <p style={{ color: 'var(--gray-500)', marginBottom: '1.75rem', fontSize: '0.98rem' }}>
                Looks like you haven't added any mouth-watering dishes yet.
              </p>
              <Link to="/restaurants" className="btn btn-primary">
                Explore Restaurants
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          ) : (
            /* 2-Column Cart Layout */
            <div className="cart-layout-grid">
              {/* Left Column: Items, Address & Rider Tip */}
              <div className="cart-left-col">
                {/* Faculty Demonstration Notice Banner */}
                <div className="faculty-demo-notice">
                  <div style={{ fontSize: '1.4rem', lineHeight: 1 }}>🎓</div>
                  <div>
                    <span className="demo-tag">Faculty Viva Demo Mode</span>
                    <div style={{ fontWeight: 700, marginBottom: '0.2rem', color: '#1E3A8A' }}>
                      Interactive Client-Side Order Fulfillment Demonstration
                    </div>
                    <div style={{ lineHeight: 1.45 }}>
                      Spring Boot REST backend serves Restaurants &amp; Food Catalog data. Order fulfillment options (Delivery ₹40 / Pickup ₹0 / Dine-in ₹0) and dynamic fee calculations are evaluated interactively in frontend client state for demonstration without persisting demo orders to MySQL.
                    </div>
                  </div>
                </div>

                {/* Active Restaurant Header */}
                <div className="cart-rest-banner">
                  <div className="cart-rest-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2Z" />
                    </svg>
                  </div>
                  <div className="cart-rest-details">
                    <h4>Royal Awadh Biryani</h4>
                    <p>Connaught Place, New Delhi • Estimated Delivery: 25-30 mins</p>
                  </div>
                  <Link to="/menu" className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>
                    + Add Items
                  </Link>
                </div>

                {/* Cart Items Table */}
                <div className="cart-card-box">
                  <div className="cart-card-header">
                    <h3>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      Order Summary
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                      {totalCount} dish{totalCount !== 1 ? 'es' : ''} selected
                    </span>
                  </div>

                  <div className="cart-items-table">
                    {cart.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemove={onRemoveFromCart}
                      />
                    ))}
                  </div>
                </div>

                {/* Order Fulfillment Selection Card (3 Fulfillment Options) */}
                <div className="cart-card-box" id="fulfillment-selection-card">
                  <div className="cart-card-header">
                    <h3>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                      Choose Order Fulfillment Option
                    </h3>
                    <span className="badge badge-secondary" id="active-fulfillment-badge">
                      {fulfillmentOption === 'delivery' && 'Delivery Selected'}
                      {fulfillmentOption === 'pickup' && 'Self Pickup Selected'}
                      {fulfillmentOption === 'dinein' && 'Dine-in Selected'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--gray-500)', marginBottom: '1.25rem' }}>
                    Select how you'd like your food prepared and served. The delivery fee and bill total will update immediately.
                  </p>

                  <div className="fulfillment-options-grid">
                    {/* Option 1: Delivery by QuickBite */}
                    <div
                      className={`fulfillment-card ${fulfillmentOption === 'delivery' ? 'selected' : ''}`}
                      data-fulfillment="delivery"
                      id="opt-delivery"
                      role="button"
                      tabIndex={0}
                      onClick={() => setFulfillmentOption('delivery')}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFulfillmentOption('delivery'); }}
                    >
                      <div className="fulfillment-card-top">
                        <div className="fulfillment-icon-wrap" title="Delivery by QuickBite">
                          🛵
                        </div>
                        <div className="fulfillment-radio-indicator"></div>
                      </div>
                      <div className="fulfillment-card-title">Delivery by QuickBite</div>
                      <div className="fulfillment-card-desc">Food delivered to your doorstep by verified delivery riders</div>
                      <div className="fulfillment-fee-pill fee-charged">+ ₹40 Delivery Fee</div>
                    </div>

                    {/* Option 2: Self Pickup / Takeaway */}
                    <div
                      className={`fulfillment-card ${fulfillmentOption === 'pickup' ? 'selected' : ''}`}
                      data-fulfillment="pickup"
                      id="opt-pickup"
                      role="button"
                      tabIndex={0}
                      onClick={() => setFulfillmentOption('pickup')}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFulfillmentOption('pickup'); }}
                    >
                      <div className="fulfillment-card-top">
                        <div className="fulfillment-icon-wrap" title="Self Pickup / Takeaway">
                          🛍️
                        </div>
                        <div className="fulfillment-radio-indicator"></div>
                      </div>
                      <div className="fulfillment-card-title">Self Pickup / Takeaway</div>
                      <div className="fulfillment-card-desc">Customer collects freshly packed food from the restaurant</div>
                      <div className="fulfillment-fee-pill fee-free">₹0 Delivery Fee (FREE)</div>
                    </div>

                    {/* Option 3: Dine-in */}
                    <div
                      className={`fulfillment-card ${fulfillmentOption === 'dinein' ? 'selected' : ''}`}
                      data-fulfillment="dinein"
                      id="opt-dinein"
                      role="button"
                      tabIndex={0}
                      onClick={() => setFulfillmentOption('dinein')}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFulfillmentOption('dinein'); }}
                    >
                      <div className="fulfillment-card-top">
                        <div className="fulfillment-icon-wrap" title="Dine-in">
                          🍽️
                        </div>
                        <div className="fulfillment-radio-indicator"></div>
                      </div>
                      <div className="fulfillment-card-title">Dine-in</div>
                      <div className="fulfillment-card-desc">Customer eats at the restaurant with reserved table service</div>
                      <div className="fulfillment-fee-pill fee-free">₹0 Delivery Fee (FREE)</div>
                    </div>
                  </div>
                </div>

                {/* (1) Delivery Address Selector (Rendered only when Delivery is active) */}
                {fulfillmentOption === 'delivery' && (
                  <>
                    <div className="cart-card-box" id="delivery-address-section">
                      <div className="cart-card-header">
                        <h3>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          Delivery Address
                        </h3>
                        <span className="view-all-link" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                          + Add New
                        </span>
                      </div>

                      <div className="address-grid">
                        {DEFAULT_ADDRESSES.map((addr) => {
                          const isSelected = selectedAddressId === addr.id;
                          return (
                            <div
                              key={addr.id}
                              className={`address-option-card ${isSelected ? 'selected' : ''}`}
                              onClick={() => setSelectedAddressId(addr.id)}
                            >
                              <div className="address-type">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                                <span>{addr.type}</span>
                                {isSelected && (
                                  <span className="badge badge-secondary" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
                                    Selected
                                  </span>
                                )}
                              </div>
                              <p className="address-text">{addr.address}</p>
                              <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '0.4rem' }}>
                                Ph: {addr.phone}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Delivery Instructions */}
                      <div>
                        <div className="form-label" style={{ marginBottom: '0.5rem' }}>Delivery Instructions for Rider:</div>
                        <div className="delivery-chips-row">
                          <span className="delivery-chip">🚪 Leave at door</span>
                          <span className="delivery-chip">🔕 Do not ring bell</span>
                          <span className="delivery-chip">📞 Avoid calling</span>
                          <span className="delivery-chip">🛡️ Contactless drop-off</span>
                        </div>
                      </div>
                    </div>

                    {/* Rider Tip Chips */}
                    <div className="cart-card-box" id="rider-tip-section">
                      <div className="cart-card-header">
                        <h3>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          Add a Tip for Delivery Partner
                        </h3>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--gray-600)', marginBottom: '0.75rem' }}>
                        100% of your tip goes directly to your delivery hero.
                      </p>
                      <div className="delivery-chips-row">
                        {[10, 20, 30, 50].map((amount) => {
                          const isActive = selectedTip === amount;
                          return (
                            <button
                              key={amount}
                              className="delivery-chip"
                              onClick={() => handleTipClick(amount)}
                              style={{
                                borderColor: isActive ? 'var(--primary)' : 'var(--gray-200)',
                                background: isActive ? 'var(--primary-light)' : 'var(--gray-100)',
                                color: isActive ? 'var(--primary)' : 'var(--gray-700)',
                                cursor: 'pointer'
                              }}
                            >
                              ₹{amount}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* (2) Self Pickup Location Card (Rendered only when Self Pickup is active) */}
                {fulfillmentOption === 'pickup' && (
                  <div className="cart-card-box" id="pickup-details-section">
                    <div className="cart-card-header">
                      <h3>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        Self Pickup / Takeaway Counter
                      </h3>
                      <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>₹0 Delivery Fee</span>
                    </div>

                    <div className="fulfillment-info-box">
                      <div className="fulfillment-info-header">
                        <div>
                          <strong>Royal Awadh Biryani - Pickup Counter</strong>
                          <span style={{ display: 'inline-block', marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--veg-color)', fontWeight: 700 }}>
                            ● Active Takeaway Station
                          </span>
                        </div>
                        <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>Ready in 15-20 Mins</span>
                      </div>
                      <p className="fulfillment-info-text">
                        📍 Shop 14-15, Inner Circle, Block C, Connaught Place, New Delhi - 110001
                      </p>
                      <div className="fulfillment-info-meta">
                        <span>📞 Restaurant Phone: +91 11 2341 5678 (Direct Kitchen Desk)</span>
                        <span>🕒 Pickup Counter Operating Hours: 11:00 AM – 11:30 PM (Mon - Sun)</span>
                        <span>⭐ Customer Collects Food: <strong>Zero Delivery Surcharge (₹0)</strong></span>
                      </div>
                      <div className="fulfillment-info-note">
                        🛍️ <strong>Takeaway Collection Protocol:</strong> Your order will be packed in heat-retaining containers and kept ready on the express pickup counter. Simply present your QuickBite Order ID to the staff to collect your meal immediately without queuing.
                      </div>
                    </div>
                  </div>
                )}

                {/* (3) Dine-in Details Card (Rendered only when Dine-in is active) */}
                {fulfillmentOption === 'dinein' && (
                  <div className="cart-card-box" id="dinein-details-section">
                    <div className="cart-card-header">
                      <h3>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                          <line x1="6" y1="1" x2="6" y2="4"></line>
                          <line x1="10" y1="1" x2="10" y2="4"></line>
                          <line x1="14" y1="1" x2="14" y2="4"></line>
                        </svg>
                        Dine-in Table Service Details
                      </h3>
                      <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>₹0 Delivery Fee</span>
                    </div>

                    <div className="fulfillment-info-box">
                      <div className="fulfillment-info-header">
                        <div>
                          <strong>Royal Awadh Biryani - Fine Dining Restaurant</strong>
                          <span style={{ display: 'inline-block', marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--veg-color)', fontWeight: 700 }}>
                            ● Seating Available
                          </span>
                        </div>
                        <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>Table on Arrival</span>
                      </div>
                      <p className="fulfillment-info-text">
                        📍 Shop 14-15, Inner Circle, Block C, Connaught Place, New Delhi - 110001
                      </p>
                      <div className="fulfillment-info-meta">
                        <span>👥 AC Dining Hall: Table reserved upon placing this dine-in request</span>
                        <span>🕒 Dine-in Service Hours: 12:00 PM – 11:30 PM</span>
                        <span>⭐ Customer Eats at Restaurant: <strong>Zero Delivery Surcharge (₹0)</strong></span>
                      </div>
                      <div className="fulfillment-info-note">
                        🍽️ <strong>Dine-in Service Protocol:</strong> When you arrive at the restaurant, inform the host/reception that you have a QuickBite Dine-in booking and share your Order ID. You will be escorted to your table, and food will be served freshly prepared from the tandoor.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Bill Summary & Checkout */}
              <div className="cart-right-col">
                <div className="bill-summary-box">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--dark-900)' }}>
                    Bill Details
                  </h3>

                  {/* Coupon Input Form */}
                  <form className="coupon-input-wrap" onSubmit={handleApplyCoupon}>
                    <input
                      type="text"
                      className="coupon-input"
                      placeholder="ENTER COUPON"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button type="submit" className="btn btn-secondary btn-sm">
                      Apply
                    </button>
                  </form>

                  {/* Active Coupon Alert Banner */}
                  {appliedCoupon && appliedCoupon.isApplied && (
                    <div className="coupon-applied-alert">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>
                        Coupon <strong>'{appliedCoupon.code}'</strong> applied! You saved up to ₹{discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Itemized Bill Rows */}
                  <div className="bill-rows-list">
                    <div className="bill-row">
                      <span>Item Total</span>
                      <span>₹{itemTotal.toFixed(2)}</span>
                    </div>
                    <div className="bill-row">
                      <span>
                        {fulfillmentOption === 'delivery' && 'Delivery Partner Fee (QuickBite)'}
                        {fulfillmentOption === 'pickup' && 'Delivery Partner Fee (Self Pickup)'}
                        {fulfillmentOption === 'dinein' && 'Delivery Partner Fee (Dine-in)'}
                      </span>
                      <div>
                        {fulfillmentOption === 'delivery' ? (
                          <span>₹40.00</span>
                        ) : (
                          <>
                            <span style={{ textDecoration: 'line-through', color: 'var(--gray-400)', marginRight: '0.3rem' }}>
                              ₹40.00
                            </span>
                            <span style={{ color: 'var(--veg-color)', fontWeight: 'bold' }}>₹0.00 FREE</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bill-row">
                      <span>Restaurant Packaging Charges</span>
                      <span>₹{packagingFee.toFixed(2)}</span>
                    </div>
                    <div className="bill-row">
                      <span>Taxes & GST (5%)</span>
                      <span>₹{taxes.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="bill-row discount-row">
                        <span>Coupon Discount ({appliedCoupon.code})</span>
                        <span>- ₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {effectiveTip > 0 && (
                      <div className="bill-row" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        <span>Delivery Partner Tip</span>
                        <span>+ ₹{effectiveTip.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="bill-row">
                      <span>Platform Fee</span>
                      <span>₹{platformFee.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="bill-row-total">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="payment-options-list">
                    <label className="payment-method-card">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                      />
                      <span>⚡ Instant UPI (GPay / PhonePe / Paytm)</span>
                    </label>
                    <label className="payment-method-card">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                      />
                      <span>💳 Credit / Debit Cards</span>
                    </label>
                    <label className="payment-method-card">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                      />
                      <span>💵 Cash on Delivery</span>
                    </label>
                  </div>

                  {/* Proceed to Pay Button */}
                  <button
                    className="btn btn-primary btn-block btn-lg"
                    id="cart-place-order-btn"
                    onClick={handleProceedToPay}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Proceed to Pay ₹{grandTotal.toFixed(2)}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                    🔒 256-Bit Encrypted Secure Checkout
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Cart;
