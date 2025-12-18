import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/globals.css";
import "./i18n/config";
import i18n from "./i18n/config";
import { I18nextProvider } from "react-i18next";
import { ThemeProvider } from "./context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

// Component to sync <html lang> and dir with i18next language
function LanguageSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const html = document.documentElement;

    // Update lang attribute (critical for :lang() CSS selectors)
    const language = i18n.resolvedLanguage || "en";
    html.lang = language;

    // Optional but recommended: handle RTL for Arabic, Hebrew, etc.
    const rtlLanguages = ["ar", "he", "fa", "ur"];
    if (rtlLanguages.includes(language)) {
      html.dir = "rtl";
    } else {
      html.dir = "ltr";
    }
  }, [i18n.resolvedLanguage]);

  return null; // This component renders nothing
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <LanguageSync /> {/* Add this line */}
        <App />
      </ThemeProvider>
    </I18nextProvider>
  </React.StrictMode>
);