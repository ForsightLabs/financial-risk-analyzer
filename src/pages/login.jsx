import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ── Spring Boot API call ──
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        username: data.username,
        role: data.role,
        firstName: data.firstName,
      }));
      window.location.href = "/";
      // ── End API call ──

    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
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
              Welcome back<span className="auth-heading__accent">.</span>
            </h1>
            <p className="auth-heading__desc">
              Sign in with your analyst credentials to continue.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            <div className="auth-field">
              <label className="auth-field__label" htmlFor="username">Username</label>
              <div className="auth-field__wrapper">
                <input
                    id="username" name="username" type="text"
                    className="auth-field__input" placeholder="analyst.id"
                    value={formData.username} onChange={handleChange}
                    autoComplete="username"
                />
                <span className="auth-field__icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-field__label" htmlFor="password">Password</label>
              <div className="auth-field__wrapper">
                <input
                    id="password" name="password"
                    type={showPassword ? "text" : "password"}
                    className="auth-field__input" placeholder="••••••••"
                    value={formData.password} onChange={handleChange}
                    autoComplete="current-password"
                />
                <button type="button"
                        className="auth-field__icon auth-field__icon--btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password"
                >
                  {showPassword ? (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                  ) : (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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

            <div className="auth-forgot">
              <a href="/forgot-password">Forgot password?</a>
            </div>

            <button type="submit"
                    className={`auth-btn ${loading ? "loading" : ""}`}
                    disabled={loading}
            >
              {loading ? <span className="auth-btn__spinner"></span> : "Sign In"}
            </button>

            <div className="auth-divider"><span>or</span></div>

            <p className="auth-switch">
              Don't have an account?{" "}
              <Link to="/signup" className="auth-switch__link">Create one</Link>
            </p>

          </form>

          <p className="auth-footer">
            Barclays Internal Platform &mdash; Authorised Access Only
          </p>
        </div>

        <div className="auth-visual">
          <div className="auth-visual__overlay"></div>
          <div className="auth-visual__content">
            <h2>AI-Driven Risk<br />Intelligence</h2>
            <p>Real-time delinquency prediction<br />and early intervention analytics.</p>
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

export default Login;