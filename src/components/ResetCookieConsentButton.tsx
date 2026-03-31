import React, { useState } from "react";

export default function ResetCookieConsentButton() {
  const [message, setMessage] = useState("");

  const handleReset = () => {
    try {
      localStorage.removeItem("cookie-consent");
      setMessage("Your saved cookie choice has been cleared. Reloading now so you can choose again.");
      window.location.reload();
    } catch {
      setMessage("I couldn't clear the saved cookie choice in this browser. You can still remove site storage manually.");
    }
  };

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <button
        type="button"
        onClick={handleReset}
        style={{
          background: "var(--ifm-color-primary)",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          padding: "0.75rem 1rem",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Reset Cookie Choice
      </button>
      {message ? <p style={{ marginTop: "0.75rem" }}>{message}</p> : null}
    </div>
  );
}
