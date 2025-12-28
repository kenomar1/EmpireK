"use client";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

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
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // Only sync HTML direction and language — no toast logic
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [isRTL, i18n.language]);

  return (
    <BrowserRouter>
      <div
        className={`
          min-h-screen flex flex-col
          ${isRTL ? "font-Cairo" : "font-playfair"}
          
        `}
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

        {/* General Toaster for other notifications (kept for future use) */}
        <Toaster
          position="bottom-center"
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