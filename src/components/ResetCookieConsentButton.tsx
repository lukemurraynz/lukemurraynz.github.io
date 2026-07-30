import React, { useState } from "react";
import styles from "./ResetCookieConsentButton.module.css";

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
    <div className={styles.wrapper}>
      <button
        type="button"
        onClick={handleReset}
        className={styles.button}
      >
        Reset Cookie Choice
      </button>
      {message ? <p className={styles.message}>{message}</p> : null}
    </div>
  );
}
