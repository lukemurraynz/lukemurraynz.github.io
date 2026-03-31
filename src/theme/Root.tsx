import React, { useState, useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "cookie-consent";

function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      // Storage blocked; proceed without persisting
    }
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
    setVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "declined");
    } catch {
      // Storage blocked; proceed without persisting
    }
    setVisible(false);
  };

  return (
    <div className="cookie-consent-banner" role="dialog" aria-label="Cookie consent">
      <p className="cookie-consent-text">
        This site uses cookies for analytics.{" "}
        <a href="/about/" className="cookie-consent-link">
          Learn more
        </a>
      </p>
      <div className="cookie-consent-actions">
        <button
          type="button"
          className="cookie-consent-btn cookie-consent-btn--accept"
          onClick={handleAccept}
        >
          Accept
        </button>
        <button
          type="button"
          className="cookie-consent-btn cookie-consent-btn--decline"
          onClick={handleDecline}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CookieConsent />
    </>
  );
}
