// src/components/HeroPromo.tsx
"use client";

import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Earth } from "lucide-react";

export function HeroPromo() {
  const { i18n, t } = useTranslation();
  const heroCopy = (key: "heading" | "subheading" | "herocta1" | "herocta2") =>
    t(`hero.${key}`);

  const isRTL = i18n.language === "ar";

  return (
    <>
      {/* Fixed Full-Screen Video Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <video
          className=" absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-fallback.jpg"
        >
          <source src="/hero-background.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Hero Content */}
      <section
        className="relative w-full min-h-screen flex items-center justify-center px-6 pt-20 md:pt-24"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="w-full max-w-5xl mx-auto text-center">
          {/* Floating Logo — centered above glass card */}
          <div className="relative -mb-12 z-20">
            <div className="inline-flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm border-2 border-white/30 p-5 shadow-2xl">
              <img
                src="/Logo.avif"
                alt="Logo"
                className="h-16 w-16 md:h-20 md:w-20"
              />
            </div>
          </div>

          {/* Glassmorphism Card — perfectly responsive */}
          <div className="relative rounded-3xl bg-black/10 backdrop-blur-sm shadow-2xl overflow-hidden">
            {/* Optional subtle gradient glow */}

            <div className="relative z-10 p-8 md:p-12 lg:p-16 pt-16 md:pt-20">
              {/* Heading */}
              <motion.div
                dir={isRTL ? "ltr" : "rtl"}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"
              >
                <Earth className="w-4 h-4" />
                {t("shopPreview.eyebrow")}
              </motion.div>
              <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-black tracking-tight text-white drop-shadow-2xl leading-tight">
                {heroCopy("heading")}
              </h1>

              {/* Subheading */}
              <p
                className="mt-6 text-lg xs:text-xl sm:text-2xl md:text-3xl font-medium text-white/90 drop-shadow-lg leading-relaxed max-w-3xl mx-auto"
                dangerouslySetInnerHTML={{ __html: heroCopy("subheading") }}
              />

              {/* CTA Buttons - Responsive */}
              <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                <Button
                  size="lg"
                  variant="default"
                  className="w-full sm:w-auto px-10 py-6 text-base md:text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl"
                  asChild
                >
                  <a href="/contact">{heroCopy("herocta2")}</a>
                </Button>

                <Button
                  size="lg"
                  variant="outline" // Changed to outline for better contrast with white bg on light/dark themes
                  className="w-full sm:w-auto px-10 py-6 text-base md:text-lg font-bold border-2 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl"
                  asChild
                >
                  <a href="/services">{heroCopy("herocta1")}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
