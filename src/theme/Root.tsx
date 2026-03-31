import React, { useEffect, useState } from "react";
import { useLocation } from "@docusaurus/router";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "cookie-consent";
const isProduction = process.env.NODE_ENV === "production";

function getConsentValue() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function updateConsent(analyticsStorage: "granted" | "denied") {
  if (!isProduction || typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("consent", "update", {
    analytics_storage: analyticsStorage,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function trackPageView() {
  if (!isProduction || typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
  });
}

function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!getConsentValue());
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      // Storage blocked; proceed without persisting
    }

    updateConsent("granted");
    setVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "declined");
    } catch {
      // Storage blocked; proceed without persisting
    }

    updateConsent("denied");
    setVisible(false);
  };

  return (
    <div className="cookie-consent-banner" role="dialog" aria-label="Cookie consent" aria-modal="false">
      <p className="cookie-consent-text">
        This site uses Google Analytics to understand visits.{" "}
        <a href="/privacy-cookies/" className="cookie-consent-link">
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
  const location = useLocation();

  useEffect(() => {
    trackPageView();
  }, [location.hash, location.pathname, location.search]);

  return (
    <>
      {children}
      <CookieConsent />
    </>
  );
}
