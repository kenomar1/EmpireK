"use client";

import React, { useState } from "react";
import {
  Globe,
  Palette,
  Code2,
  Store,
  Search,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const SERVICE_CONFIG = [
  { id: "web-development", icon: Globe },
  { id: "E-Commerce Stores", icon: Store },
  { id: "ui-ux", icon: Palette },
  { id: "cms", icon: Code2 },
  { id: "seo", icon: Search },
  { id: "maintenance", icon: Shield },
];

const DEFAULT_SERVICE = SERVICE_CONFIG[0].id;

export default function AgencyServicesPage() {
  const [activeService, setActiveService] = useState(DEFAULT_SERVICE);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const servicesRaw = t("services", { returnObjects: true });
  const servicesCopy =
    servicesRaw && typeof servicesRaw === "object" ? servicesRaw : {};
  const currentService = servicesCopy[activeService] || {};

  const heroTitle = t("servicesPage.heroTitle");
  const heroSubtitle = t("servicesPage.heroSubtitle");
  const orderCta = t("servicesPage.orderCta");
  const priceValue = t("servicesPage.price");
  const timelineValue = t("servicesPage.timeline");
  const orderMeta = t("servicesPage.orderMeta", {
    price: priceValue,
    timeline: timelineValue,
  });

  const CurrentIcon =
    SERVICE_CONFIG.find((s) => s.id === activeService)?.icon || Globe;

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-background  via-background to-muted/30 py-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/80 backdrop-blur-xl text-center py-16 sm:py-20 border-b border-border/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {heroTitle}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Service Tabs – Sticky on Large Screens */}
          <div className="w-full lg:w-80 lg:sticky lg:top-24 h-fit">
            <div className="flex lg:flex-col gap-4 overflow-x-auto scrollbar-hide pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
              {SERVICE_CONFIG.map((service) => {
                const Icon = service.icon;
                const isActive = activeService === service.id;
                const copy = servicesCopy[service.id] || {};

                return (
                  <motion.button
                    key={service.id}
                    onClick={() => setActiveService(service.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center gap-4 px-6 py-5 rounded-2xl whitespace-nowrap flex-shrink-0
                      min-w-[220px] sm:min-w-[260px] lg:min-w-0 lg:w-full
                      transition-all duration-300 group relative overflow-hidden
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-2xl ring-4 ring-primary/20"
                          : "bg-card hover:bg-accent/70 border border-border hover:border-primary/30 text-muted-foreground"
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeServiceBubble"
                        className="absolute inset-0 bg-primary/20"
                        style={{ borderRadius: 16 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-4 w-full">
                      <div
                        className={`p-3 rounded-xl ${
                          isActive ? "bg-white/20" : "bg-primary/10"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            isActive ? "text-white" : "text-primary"
                          }`}
                        />
                      </div>
                      <span className="font-semibold text-left flex-1">
                        {copy.name || service.id.replace("-", " ")}
                      </span>
                      {isActive && <ArrowRight className="w-5 h-5" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <motion.div
            key={activeService}
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 space-y-12"
          >
            {/* Service Overview Card */}
            <div className="relative overflow-hidden bg-card/90 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border border-border/50">
              <div className="flex flex-col sm:flex-row items-start gap-8">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="p-5 bg-primary/10 rounded-3xl"
                >
                  <CurrentIcon className="w-14 h-14 text-primary" />
                </motion.div>
                <div className="flex-1">
                  <h2 className="text-3xl sm:text-4xl font-black mb-4">
                    {currentService.title}
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {currentService.shortDesc}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
                {(currentService.features || []).map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-background/50 hover:bg-primary/5 transition-colors"
                  >
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-3 px-8 py-5 bg-primary text-primary-foreground rounded-full font-bold text-lg shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
                  >
                    {orderCta} <ArrowRight className="w-6 h-6" />
                  </a>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {orderMeta}
                  </p>
                </div>
              </div>
            </div>

            {/* ENHANCED RICH SEO CONTENT – NO DANGEROUS HTML */}
            {currentService.seoHeading && (
              <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-muted/50 rounded-3xl p-10 sm:p-16 border border-border/50">
                {/* Floating Orbs */}
                <div className="absolute top-10 left-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

                <div className="relative z-10 max-w-5xl mx-auto">
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl sm:text-5xl font-black text-center mb-12 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent"
                  >
                    <Sparkles className="inline-block w-10 h-10 mb-4" />
                    <br />
                    {currentService.seoHeading}
                  </motion.h2>

                  <div className="space-y-8 text-lg leading-8 text-foreground/80">
                    {currentService.seoBody?.split("\n\n").map((block, idx) => {
                      const text = block.trim();
                      if (!text) return null;

                      if (text.startsWith("# ")) {
                        return (
                          <motion.h3
                            key={idx}
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="text-3xl font-bold mt-16 first:mt-0 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                          >
                            {text.replace("# ", "")}
                          </motion.h3>
                        );
                      }

                      const parts = text.split(/\*\*(.*?)\*\*/g);
                      return (
                        <motion.p
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          className="text-lg sm:text-xl leading-9 text-muted-foreground"
                        >
                          {parts.map((part, i) =>
                            i % 2 === 1 ? (
                              <span key={i} className="font-bold text-primary">
                                {part}
                              </span>
                            ) : (
                              part
                            )
                          )}
                        </motion.p>
                      );
                    })}
                  </div>

                  {currentService.seoQuote && (
                    <motion.blockquote
                      initial={{ scale: 0.95, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      className="mt-16 p-10 bg-primary/10 border-l-8 border-primary rounded-r-2xl italic text-2xl font-medium text-center"
                    >
                      “{currentService.seoQuote}”
                    </motion.blockquote>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-16"
                  >
                    <a
                      href="/contact"
                      className="inline-flex items-center gap-4 px-10 py-6 bg-primary text-primary-foreground rounded-full text-xl font-bold shadow-2xl hover:shadow-primary/40 hover:scale-110 transition-all duration-300"
                    >
                      {orderCta} <ArrowRight className="w-6 h-6" />
                    </a>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
