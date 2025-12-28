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

// React Query imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Component to sync <html lang> and dir with i18next language
function LanguageSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const html = document.documentElement;

    // Update lang attribute
    const language = i18n.resolvedLanguage || "en";
    html.lang = language;

    // Handle RTL languages
    const rtlLanguages = ["ar", "he", "fa", "ur"];
    html.dir = rtlLanguages.includes(language) ? "rtl" : "ltr";
  }, [i18n.resolvedLanguage]);

  return null;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageSync />
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </I18nextProvider>
  </React.StrictMode>
);
