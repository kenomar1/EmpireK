// src/app/page.tsx  (or src/pages/index.tsx — wherever your Home is)
"use client";

import { HeroPromo } from "../components/sections/HeroSection";
import { FixedNavbar } from "../components/layout/NavBar";
import { TextWithImageSection } from "../components/sections/TextWithImageSection";
import { FloatingBenefits } from "../components/sections/FloatingBenefits";
import ServicesShowcaseSection from "../components/sections/ServicesShowcase";
import HowWeWork from "../components/sections/HowWeWork";
import CMSDemoSection from "../components/sections/CMSDemoSection";
import Footer from "../components/layout/Footer";

import { useTranslation } from "react-i18next";

export default function Home() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <FixedNavbar />
      <main className="pt-16">
        <HeroPromo />
        <TextWithImageSection />
        <FloatingBenefits />
        <ServicesShowcaseSection />
        <HowWeWork />
        <CMSDemoSection />
      </main>
      <Footer />
    </div>
  );
}
