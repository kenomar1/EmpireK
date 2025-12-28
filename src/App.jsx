"use client";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { FixedNavbar } from "./components/layout/NavBar";
import i18n from "./i18n/config";
import ServiceGalleryPage from "./pages/ServiceGalleryPage";
import ContactPage from "./pages/ContactPage";
import Blog from "./pages/blogPage";
import BlogPostPage from "./pages/BlogPostPage";
import Services from "./pages/services";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import { Toaster } from "react-hot-toast";

function App() {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;

    const hasSeen = localStorage.getItem("hasSeenCookieToast");
    if (!hasSeen) {
      const id = toast(
        <div
          className={`flex items-start gap-4 max-w-md ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <div className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="Empire-K"
              className="w-14 h-14 rounded-xl object-contain shadow-lg"
            />
          </div>
          <div className="flex-1">
            <p className="text-base font-medium">{t("cookieToast.message")}</p>
            <div
              className={`flex gap-6 mt-4 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <button
                onClick={() => toast.dismiss(id)}
                className="text-base font-semibold text-primary hover:underline"
              >
                {t("cookieToast.learnMore")}
              </button>
              <button
                onClick={() => {
                  localStorage.setItem("hasSeenCookieToast", "true");
                  toast.dismiss(id);
                }}
                className="text-base font-medium text-muted-foreground hover:underline"
              >
                {t("cookieToast.gotIt")}
              </button>
            </div>
          </div>
        </div>,
        {
          duration: 15000,
          position: "top-center",
          style: {
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "24px",
            maxWidth: "540px",
            boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
            fontSize: "16px",
            marginLeft: "32px",
          },
        }
      );

      setTimeout(
        () => localStorage.setItem("hasSeenCookieToast", "true"),
        16000
      );
    }
  }, []); // ← Only once

  return (
    <BrowserRouter>
      <div
        className={`min-h-screen flex flex-col ${isRTL ? "font-Cairo" : "font-playfair"} `}
      >
        <FixedNavbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<ServiceGalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/project/:slug" element={<ProjectDetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 5000,
            style: {
              background: "var(--background)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
