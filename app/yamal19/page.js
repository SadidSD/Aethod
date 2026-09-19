"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useTheme } from "../context/ThemeContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { isDark } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Use full navigation to ensure session cookie is immediately registered by the browser
        window.location.href = data.redirect || "/yamal19/analytics";
      } else {
        setErrorMessage(data.error || "Invalid credentials. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setErrorMessage("Network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.gatewayContainer}
      data-theme={isDark ? "dark" : "light"}
      suppressHydrationWarning={true}
    >
      <div className={styles.ambientBackdrop} aria-hidden="true" />

      <main className={styles.authCard}>
        {/* Aeethod 3D Porcelain Emblem */}
        <div className={styles.logoWrapper}>
          <img
            src="/logo-icon.png"
            alt="Aeethod Logo"
            className={styles.brandLogo}
          />
        </div>

        {/* Small Label */}
        <span className={styles.studioLabel}>AEETHOD STUDIO</span>

        {/* Main Heading */}
        <h1 className={styles.mainHeading}>Studio Access</h1>

        {/* Supporting Text */}
        <p className={styles.supportingText}>
          Private workspace for Aeethod analytics &amp; operations.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate={false}>
          {/* Email Group */}
          <div className={styles.inputGroup}>
            <label htmlFor="admin-email" className={styles.inputLabel}>
              Email
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="admin-email"
                type="email"
                name="email"
                placeholder="studio@aeethod.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                required
                disabled={loading}
                className={styles.inputField}
              />
            </div>
          </div>

          {/* Password Group */}
          <div className={styles.inputGroup}>
            <label htmlFor="admin-password" className={styles.inputLabel}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
                className={`${styles.inputField} ${styles.passwordInput}`}
              />
              <button
                type="button"
                className={styles.visibilityToggle}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {showPassword ? (
                  /* Eye Off SVG */
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  /* Eye SVG */
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Accessible Error Message */}
          {errorMessage && (
            <div className={styles.errorBanner} role="alert" aria-live="assertive">
              {errorMessage}
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? (
              <span className={styles.loadingText}>
                <span className={styles.spinnerDot} />
                Authenticating...
              </span>
            ) : (
              "Enter Studio"
            )}
          </button>
        </form>

        {/* Quiet Subtext */}
        <span className={styles.authorizedNote}>Authorized access only.</span>
      </main>
    </div>
  );
}
