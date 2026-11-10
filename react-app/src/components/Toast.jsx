import React, { useEffect } from 'react';

/**
 * Toast Component
 * Sleek floating notification at the bottom right corner for feedback (cart updates, coupons, login alerts).
 */
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isError = type === 'error';
  const isInfo = type === 'info';

  const borderColor = isError ? '#EF4444' : isInfo ? '#38BDF8' : '#FF5722';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 999999,
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          background: isError ? '#1E293B' : isInfo ? '#0F172A' : '#0B0F17',
          color: '#FFFFFF',
          padding: '0.85rem 1.35rem',
          borderRadius: 12,
          fontSize: '0.92rem',
          fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
          border: `1px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          pointerEvents: 'auto',
          maxWidth: 380,
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <span>{message}</span>
      </div>
    </div>
  );
}

export default Toast;
