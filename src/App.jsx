"use client";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "react-hot-toast";

// Lazy load route components
const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/services"));
const ServiceGalleryPage = lazy(() => import("./pages/ServiceGalleryPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const Blog = lazy(() => import("./pages/blogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard")); // Admin Dashboard

import { FixedNavbar } from "./components/layout/NavBar";
import { useTheme } from "./context/ThemeContext";
import VantaBackground from "./components/common/VantaBackground";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Loading component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function AppContent() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const location = useLocation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [isRTL, i18n.language, location.pathname]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Global Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <VantaBackground theme={theme} />
      </div>

      {/* Global Backdrop Blur & Tint Overlay */}
      <div className={`fixed inset-0 -z-10 ${theme === 'dark' ? '' : 'backdrop-blur-sm bg-background/30'} pointer-events-none`} />

      <FixedNavbar />

      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/gallery" element={<ServiceGalleryPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/project/:slug" element={<ProjectDetailPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

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
  );
}
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;