import React from 'react';
import { Link } from 'react-router-dom';

/**
 * OrderModal Component
 * Confirmation modal popup shown after a user clicks "Proceed to Pay" during checkout.
 */
function OrderModal({ isOpen, details, onClose }) {
  if (!isOpen || !details) return null;

  return (
    <div
      id="order-success-modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '1.5rem',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={(e) => {
        if (e.target.id === 'order-success-modal') {
          onClose();
        }
      }}
    >
      <div
        style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '520px',
          width: '100%',
          padding: '2.5rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--gray-200)',
          position: 'relative',
          animation: 'slideUp 0.35s ease'
        }}
      >
        {/* Animated Green Checkmark */}
        <div
          style={{
            width: '72px',
            height: '72px',
            background: 'var(--veg-bg)',
            color: 'var(--veg-color)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2.2rem',
            boxShadow: '0 8px 20px rgba(22, 163, 74, 0.2)'
          }}
        >
          ✓
        </div>

        <h2 style={{ fontSize: '1.8rem', color: 'var(--dark-900)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
          Order Placed Successfully!
        </h2>
        <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
          Thank you for ordering with QuickBite. Your meal is being freshly prepared by the kitchen.
        </p>

        {/* Order Details Receipt Card */}
        <div
          style={{
            background: 'var(--gray-50)',
            border: '1px solid var(--gray-200)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '1.25rem',
            fontSize: '0.9rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--gray-500)' }}>Order ID:</span>
            <strong style={{ color: 'var(--dark-900)', fontFamily: 'var(--font-heading)' }}>{details.orderId}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--gray-500)' }}>Fulfillment Type:</span>
            <strong style={{ color: 'var(--primary)' }}>{details.fulfillmentTitle || 'Delivery by QuickBite'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--gray-500)' }}>Delivery Fee:</span>
            <span style={{ fontWeight: 700, color: (details.deliveryFeeCharged && details.deliveryFeeCharged.includes('FREE')) ? 'var(--veg-color)' : 'var(--dark-900)' }}>
              {details.deliveryFeeCharged || '₹40.00'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--gray-500)' }}>Items:</span>
            <span>{details.itemCount} item(s)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--gray-500)' }}>Amount Paid:</span>
            <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>₹{details.grandTotal}</strong>
          </div>
          {details.selectedPayment && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--gray-500)' }}>Payment Method:</span>
              <span>{details.selectedPayment}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--gray-500)' }}>Location:</span>
            <span style={{ textAlign: 'right', maxWidth: '60%', fontSize: '0.85rem' }}>{details.fulfillmentLocation || details.selectedAddress}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--gray-500)' }}>Estimated Time:</span>
            <span style={{ color: 'var(--veg-color)', fontWeight: 700 }}>{details.fulfillmentEstimate || '⚡ 25-30 Minutes'}</span>
          </div>
        </div>

        {/* Faculty Demonstration Notice Banner */}
        <div
          style={{
            padding: '0.75rem 1rem',
            background: '#EFF6FF',
            border: '1.5px solid #BFDBFE',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            color: '#1E40AF',
            textAlign: 'left',
            lineHeight: 1.45,
            marginBottom: '1.5rem'
          }}
        >
          🎓 <strong>Faculty Viva Demo Notice:</strong> Order state evaluated and completed in interactive client-side demonstration mode. Delivery fee (₹40 / ₹0) verified dynamically. (Spring Boot REST backend serves catalog data; demo orders are not stored in MySQL).
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
            Back to Home
          </Link>
          <Link to="/restaurants" onClick={onClose} className="btn btn-primary" style={{ flex: 1 }}>
            Order More Food
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;
