import React from 'react';

/**
 * CartItem Component
 * Represents a single item inside the shopping cart table with quantity controls.
 */
function CartItem({ item, onUpdateQuantity, onRemove }) {
  const itemSubtotal = (item.price * item.quantity).toFixed(2);

  return (
    <div className="cart-item-row">
      <span className={`food-type-icon ${item.isVeg ? 'veg' : 'non-veg'}`}></span>

      <div style={{ flex: 1 }}>
        <h4 className="cart-item-title">{item.name}</h4>
        {item.subtitle && (
          <div className="cart-item-subtitle">{item.subtitle}</div>
        )}
        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.2rem', fontWeight: 600 }}>
          ₹{item.price.toFixed(2)} each
        </div>
      </div>

      {/* Quantity Increment / Decrement Counter */}
      <div className="cart-qty-counter">
        <button
          className="qty-btn btn-qty-decrease"
          onClick={() => onUpdateQuantity(item.id, -1)}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="qty-display">{item.quantity}</span>
        <button
          className="qty-btn btn-qty-increase"
          onClick={() => onUpdateQuantity(item.id, 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Item Total Price */}
      <div className="cart-item-price">₹{itemSubtotal}</div>

      {/* Remove Item Button */}
      {onRemove && (
        <button
          onClick={() => onRemove(item.id)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--gray-400)',
            cursor: 'pointer',
            fontSize: '1.1rem',
            padding: '0 0.4rem',
            transition: 'color var(--transition-fast)'
          }}
          title="Remove from cart"
          aria-label="Remove item"
        >
          &times;
        </button>
      )}
    </div>
  );
}

export default CartItem;
