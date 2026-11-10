import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Login Page (/login)
 * Split-card Authentication component with Sign In & Create Account tabs, controlled inputs, validation, and localStorage auth state.
 */
function Login({ onLoginSuccess, showToast }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin');

  // Sign In form state
  const [signInEmail, setSignInEmail] = useState('rahul.sharma@example.com');
  const [signInPassword, setSignInPassword] = useState('Password@123');

  // Sign Up form state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Form alert messages
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });

  const handleSignInSubmit = (e) => {
    e.preventDefault();

    const emailVal = signInEmail.trim();
    const passVal = signInPassword.trim();

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    const isPhoneValid = /^[6-9]\d{9}$/.test(emailVal.replace(/\D/g, ''));

    if (!emailVal) {
      setAlert({ show: true, message: 'Please enter your email or 10-digit mobile number.', type: 'error' });
      return;
    }

    if (!isEmailValid && !isPhoneValid) {
      setAlert({ show: true, message: 'Please enter a valid email address (e.g. rahul@example.com) or 10-digit mobile number.', type: 'error' });
      return;
    }

    if (!passVal || passVal.length < 6) {
      setAlert({ show: true, message: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }

    const userName = emailVal.includes('@') ? emailVal.split('@')[0] : 'User';
    const capitalizedUser = userName.charAt(0).toUpperCase() + userName.slice(1);

    const userObj = {
      name: capitalizedUser,
      email: emailVal,
      isLoggedIn: true
    };

    setAlert({ show: true, message: `🎉 Welcome back, ${capitalizedUser}! Signing you in...`, type: 'success' });
    if (showToast) showToast(`Signed in successfully as ${capitalizedUser}! 👋`);

    onLoginSuccess(userObj);

    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();

    const nameVal = signUpName.trim();
    const emailVal = signUpEmail.trim();
    const phoneVal = signUpPhone.trim().replace(/\D/g, '');
    const passVal = signUpPassword.trim();

    if (!nameVal || nameVal.length < 2) {
      setAlert({ show: true, message: 'Please enter your full name (minimum 2 characters).', type: 'error' });
      return;
    }

    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setAlert({ show: true, message: 'Please enter a valid email address (e.g. priya@example.com).', type: 'error' });
      return;
    }

    if (!phoneVal || phoneVal.length < 10) {
      setAlert({ show: true, message: 'Please enter a valid 10-digit mobile number.', type: 'error' });
      return;
    }

    if (!passVal || passVal.length < 8) {
      setAlert({ show: true, message: 'Please choose a stronger password with at least 8 characters.', type: 'error' });
      return;
    }

    const userObj = {
      name: nameVal,
      email: emailVal,
      phone: phoneVal,
      isLoggedIn: true
    };

    setAlert({ show: true, message: `🎉 Account created successfully! Welcome to QuickBite, ${nameVal}!`, type: 'success' });
    if (showToast) showToast(`Account created for ${nameVal}! 🚀`);

    onLoginSuccess(userObj);

    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <main className="auth-wrapper">
      <div className="auth-container-card">
        {/* Left Hero Showcase Column */}
        <div className="auth-hero-side">
          <div>
            <div className="brand-logo" style={{ color: 'var(--white)', marginBottom: '2rem' }}>
              <div className="logo-icon" style={{ boxShadow: 'none' }}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2Z" />
                </svg>
              </div>
              Quick<span className="highlight" style={{ color: '#FF782D' }}>Bite</span>
            </div>

            <div className="auth-hero-content">
              <h2>Delicious meals are just a bite away</h2>
              <p>
                Join over 100,000 food enthusiasts enjoying lightning-fast delivery and mouth-watering meals from the best local restaurants.
              </p>
            </div>

            <div className="auth-perks-list">
              <div className="auth-perk-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Instant order tracking & real-time delivery status</span>
              </div>
              <div className="auth-perk-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Exclusive coupons & member-only festive deals</span>
              </div>
              <div className="auth-perk-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Save multiple delivery addresses for one-tap checkout</span>
              </div>
              <div className="auth-perk-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Zero cancellation fees on instant orders</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--gray-400)', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            🔒 256-Bit SSL Encrypted & Protected
          </div>
        </div>

        {/* Right Form Column */}
        <div className="auth-form-side">
          {/* Tab Navigation */}
          <div className="auth-tabs-nav">
            <button
              className={`auth-tab-label ${activeTab === 'signin' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('signin');
                setAlert({ show: false, message: '', type: 'error' });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'signin' ? 'var(--primary)' : 'var(--gray-400)',
                borderBottom: activeTab === 'signin' ? '2.5px solid var(--primary)' : 'none'
              }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab-label ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('signup');
                setAlert({ show: false, message: '', type: 'error' });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'signup' ? 'var(--primary)' : 'var(--gray-400)',
                borderBottom: activeTab === 'signup' ? '2.5px solid var(--primary)' : 'none'
              }}
            >
              Create Account
            </button>
          </div>

          {/* Inline Alert Feedback */}
          {alert.show && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: alert.type === 'success' ? 'var(--veg-bg)' : '#FEE2E2',
                color: alert.type === 'success' ? 'var(--veg-color)' : '#DC2626',
                border: alert.type === 'success' ? '1px solid rgba(22, 163, 74, 0.3)' : '1px solid rgba(220, 38, 38, 0.3)'
              }}
            >
              <span>{alert.type === 'success' ? '✓' : '⚠️'}</span>
              <span>{alert.message}</span>
            </div>
          )}

          {/* Pane 1: Sign In Form */}
          {activeTab === 'signin' ? (
            <div>
              <form onSubmit={handleSignInSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="signin-email">
                    Email Address or Phone Number
                  </label>
                  <div className="input-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <input
                      type="text"
                      id="signin-email"
                      className="form-control"
                      placeholder="e.g. rahul.sharma@example.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signin-password">
                    Password
                  </label>
                  <div className="input-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <input
                      type="password"
                      id="signin-password"
                      className="form-control"
                      placeholder="••••••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-meta-row">
                  <label className="form-checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Remember me</span>
                  </label>
                  <span className="forgot-link" style={{ cursor: 'pointer' }}>
                    Forgot password?
                  </span>
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-lg" id="btn-submit-signin">
                  Sign In to QuickBite
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </form>

              <div className="social-auth-divider">or continue with</div>

              <div className="social-btns-grid">
                <button
                  type="button"
                  className="social-btn"
                  onClick={() => {
                    setSignInEmail('rahul.sharma@google.com');
                    setSignInPassword('GooglePass123');
                  }}
                >
                  <svg viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                  Google
                </button>
                <button type="button" className="social-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.35-.58.66-1.08 1.73-.95 2.76 1.01.08 2.05-.51 2.68-1.26z" />
                  </svg>
                  Apple
                </button>
              </div>
            </div>
          ) : (
            /* Pane 2: Sign Up Form */
            <div>
              <form onSubmit={handleSignUpSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-name">
                    Full Name
                  </label>
                  <div className="input-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <input
                      type="text"
                      id="signup-name"
                      className="form-control"
                      placeholder="e.g. Priya Patel"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-email">
                    Email Address
                  </label>
                  <div className="input-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <input
                      type="email"
                      id="signup-email"
                      className="form-control"
                      placeholder="e.g. priya@example.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-phone">
                    Mobile Number
                  </label>
                  <div className="input-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <input
                      type="tel"
                      id="signup-phone"
                      className="form-control"
                      placeholder="e.g. 9876543210"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-pass">
                    Create Password
                  </label>
                  <div className="input-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <input
                      type="password"
                      id="signup-pass"
                      className="form-control"
                      placeholder="Minimum 8 characters"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-meta-row">
                  <label className="form-checkbox-label">
                    <input type="checkbox" required defaultChecked />
                    <span style={{ fontSize: '0.8rem' }}>
                      I agree to QuickBite's Terms & Conditions
                    </span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-lg" id="btn-submit-signup">
                  Create QuickBite Account
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Login;
