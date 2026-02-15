import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "RISK_ANALYST",
  });
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirmPassword, setShowConfirm] = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState("");
  const [success, setSuccess]                 = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!formData.firstName || !formData.lastName) return "Please enter your full name";
    if (!formData.email.includes("@"))             return "Please enter a valid email";
    if (!formData.username)                        return "Please enter a username";
    if (formData.password.length < 8)             return "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError("");

    try {
      // ── Spring Boot API call ──
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName:  formData.lastName,
          email:     formData.email,
          username:  formData.username,
          password:  formData.password,
          role:      formData.role,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => window.location.href = "/login", 2000);
      // ── End API call ──

    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="auth-page">

        <div className="auth-panel">
          <div className="auth-brand">
            <span className="auth-brand__text">BARCLAYS</span>
            <span className="auth-brand__dot">.</span>
          </div>

          <div className="auth-heading">
            <p className="auth-heading__sub">RISK MONITOR PLATFORM</p>
            <h1 className="auth-heading__title">
              Create account<span className="auth-heading__accent">.</span>
            </h1>
            <p className="auth-heading__desc">Register your analyst profile to get started.</p>
          </div>

          {success ? (
              <div className="auth-success">
                <span className="auth-success__icon">✓</span>
                <p>Account created successfully!</p>
                <span>Redirecting to login...</span>
              </div>
          ) : (
              <form className="auth-form" onSubmit={handleSubmit} noValidate>

                <div className="auth-row">
                  <div className="auth-field">
                    <label className="auth-field__label" htmlFor="firstName">First Name</label>
                    <div className="auth-field__wrapper">
                      <input id="firstName" name="firstName" type="text"
                             className="auth-field__input" placeholder="John"
                             value={formData.firstName} onChange={handleChange} />
                      <span className="auth-field__icon">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                    </div>
                  </div>

                  <div className="auth-field">
                    <label className="auth-field__label" htmlFor="lastName">Last Name</label>
                    <div className="auth-field__wrapper">
                      <input id="lastName" name="lastName" type="text"
                             className="auth-field__input" placeholder="Doe"
                             value={formData.lastName} onChange={handleChange} />
                      <span className="auth-field__icon">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                    </div>
                  </div>
                </div>

                <div className="auth-field">
                  <label className="auth-field__label" htmlFor="email">Email</label>
                  <div className="auth-field__wrapper">
                    <input id="email" name="email" type="email"
                           className="auth-field__input" placeholder="john.doe@barclays.com"
                           value={formData.email} onChange={handleChange} autoComplete="email" />
                    <span className="auth-field__icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                  </div>
                </div>

                <div className="auth-field">
                  <label className="auth-field__label" htmlFor="username">Username</label>
                  <div className="auth-field__wrapper">
                    <input id="username" name="username" type="text"
                           className="auth-field__input" placeholder="analyst.id"
                           value={formData.username} onChange={handleChange} autoComplete="username" />
                    <span className="auth-field__icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                  </svg>
                </span>
                  </div>
                </div>

                <div className="auth-field">
                  <label className="auth-field__label" htmlFor="role">Role</label>
                  <div className="auth-field__wrapper">
                    <select id="role" name="role"
                            className="auth-field__input auth-field__select"
                            value={formData.role} onChange={handleChange}>
                      <option value="RISK_ANALYST">Risk Analyst</option>
                      <option value="CREDIT_MONITOR">Credit Monitoring</option>
                      <option value="COLLECTIONS">Collections Strategy</option>
                      <option value="PORTFOLIO_MGR">Portfolio Manager</option>
                      <option value="COMPLIANCE">Compliance Officer</option>
                    </select>
                  </div>
                </div>

                <div className="auth-field">
                  <label className="auth-field__label" htmlFor="password">Password</label>
                  <div className="auth-field__wrapper">
                    <input id="password" name="password"
                           type={showPassword ? "text" : "password"}
                           className="auth-field__input" placeholder="Min. 8 characters"
                           value={formData.password} onChange={handleChange}
                           autoComplete="new-password" />
                    <button type="button" className="auth-field__icon auth-field__icon--btn"
                            onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
                      {showPassword ? (
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                      ) : (
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="auth-field">
                  <label className="auth-field__label" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="auth-field__wrapper">
                    <input id="confirmPassword" name="confirmPassword"
                           type={showConfirmPassword ? "text" : "password"}
                           className="auth-field__input" placeholder="Re-enter password"
                           value={formData.confirmPassword} onChange={handleChange}
                           autoComplete="new-password" />
                    <button type="button" className="auth-field__icon auth-field__icon--btn"
                            onClick={() => setShowConfirm(!showConfirmPassword)}
                            aria-label="Toggle confirm password">
                      {showConfirmPassword ? (
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                      ) : (
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                    <div className="auth-error"><span>⚠</span> {error}</div>
                )}

                <button type="submit"
                        className={`auth-btn ${loading ? "loading" : ""}`}
                        disabled={loading}>
                  {loading ? <span className="auth-btn__spinner"></span> : "Create Account"}
                </button>

                <div className="auth-divider"><span>or</span></div>

                <p className="auth-switch">
                  Already have an account?{" "}
                  <Link to="/login" className="auth-switch__link">Sign in</Link>
                </p>

              </form>
          )}

          <p className="auth-footer">Barclays Internal Platform &mdash; Authorised Access Only</p>
        </div>

        <div className="auth-visual">
          <div className="auth-visual__overlay"></div>
          <div className="auth-visual__content">
            <h2>Join the Risk<br />Intelligence Network</h2>
            <p>Monitor, predict and intervene<br />before delinquency occurs.</p>
            <div className="auth-visual__stats">
              <div className="auth-visual__stat">
                <span className="stat-value">94%</span>
                <span className="stat-label">Prediction Accuracy</span>
              </div>
              <div className="auth-visual__stat">
                <span className="stat-value">2–4W</span>
                <span className="stat-label">Early Warning</span>
              </div>
              <div className="auth-visual__stat">
                <span className="stat-value">Live</span>
                <span className="stat-label">Risk Alerts</span>
              </div>
            </div>
          </div>
        </div>

      </div>
  );
}

export default Signup;