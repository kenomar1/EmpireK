// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

import { HeroPromo } from "../components/sections/HeroSection";
import { FixedNavbar } from "../components/layout/NavBar";
import { TextWithImageSection } from "../components/sections/TextWithImageSection";
import { FloatingBenefits } from "../components/sections/FloatingBenefits";
import ServicesShowcaseSection from "../components/sections/ServicesShowcase";
import HowWeWork from "../components/sections/HowWeWork";
import CMSDemoSection from "../components/sections/CMSDemoSection";
import Footer from "../components/layout/Footer";

import { useTranslation } from "react-i18next";
import BlogShowcaseSection from "../components/sections/BlogShowcaseSection";

export default function Home() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Show button when scrolled down more than 500px
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="mt-[-300px]" dir={isRTL ? "rtl" : "ltr"}>
      <FixedNavbar />
      <main className="pt-16 font-Cairo">
        <HeroPromo />
        <TextWithImageSection />
        <FloatingBenefits />
        <ServicesShowcaseSection />
        <HowWeWork />
        <CMSDemoSection />
        <BlogShowcaseSection />
      </main>
      <Footer />

      {/* Premium Back-to-Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-primary/10 backdrop-blur-sm shadow-2xl border border-white/50 flex items-center justify-center text-primary hover:bg-transparent transition-all duration-300"
            aria-label="Back to top"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
