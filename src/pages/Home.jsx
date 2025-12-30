// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";


import { TextWithImageSection } from "../components/sections/TextWithImageSection";
import { FloatingBenefits } from "../components/sections/FloatingBenefits";
import HowWeWork from "../components/sections/HowWeWork";
import CMSDemoSection from "../components/sections/CMSDemoSection";
import Footer from "../components/layout/Footer";

import { useTranslation } from "react-i18next";
import { lazy, Suspense } from "react";

// Lazy load heavy sections
const HeroPromo = lazy(() => import("../components/sections/HeroSection").then(m => ({ default: m.HeroPromo })));
const ServicesShowcaseSection = lazy(() => import("../components/sections/ServicesShowcase"));
const BlogShowcaseSection = lazy(() => import("../components/sections/BlogShowcaseSection"));
const ClientLogos = lazy(() => import("../components/sections/ClientLogos"));
const StatsCounter = lazy(() => import("../components/sections/StatsCounter"));
const FAQSection = lazy(() => import("../components/sections/FAQSection"));

import StickyCTA from "../components/common/StickyCTA";


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
    <div dir={isRTL ? "rtl" : "ltr"}>
      <main className="font-cairo overflow-x-hidden">
        <Suspense fallback={<div className="h-screen bg-background" />}>
          <HeroPromo />
        </Suspense>
        
        <div className="pb-16 md:pb-24">
          <TextWithImageSection />
        </div>
        
        <div className="py-8 md:py-12">
          <FloatingBenefits />
        </div>
        
        {/* Client Logos right after FloatingBenefits */}
        <Suspense fallback={<div className="h-32 bg-background" />}>
          <ClientLogos />
        </Suspense>
        
        {/* Stats Counter */}
        <Suspense fallback={<div className="h-64 bg-background" />}>
          <StatsCounter />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 bg-background" />}>
          <div className="py-16 md:py-24">
            <ServicesShowcaseSection />
          </div>
        </Suspense>
        
        <div className="py-8 md:py-12">
          <HowWeWork />
        </div>
        
        {/* FAQ Section */}
        <Suspense fallback={<div className="h-96 bg-background" />}>
          <FAQSection />
        </Suspense>
        
        <div className="pt-16 pb-0 md:pt-24 md:pb-0">
          <CMSDemoSection />
        </div>
        
        <Suspense fallback={<div className="h-96 bg-background" />}>
          <div className="pt-8 pb-16 md:pt-12 md:pb-24">
            <BlogShowcaseSection />
          </div>
        </Suspense>
      </main>

      <Footer />

      
      {/* Sticky CTA Bar */}
      <StickyCTA />
      
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
