// src/components/ui/CMSDemoPage.tsx
"use client";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function CMSDemoSection() {
  const { i18n, t } = useTranslation();
  const cms = (key, options) => t(`cmsDemo.${key}`, options);

  const isRTL = i18n.language === "ar";

  return (
    <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-transparent pt-32 pb-32">
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10 p-12 rounded-3xl glass-panel">
          <Badge className="mb-6" variant="secondary">
            {cms("badge")}
          </Badge>
          <h1 className="text-5xl font-Cairo font-playfair md:text-7xl font-bold mb-8 text-foreground">
            {cms("heading")}
          </h1>
          <p
            className="text-xl md:text-2xl text-foreground/90 max-w-4xl font-semibold mx-auto leading-relaxed mb-12"
            dangerouslySetInnerHTML={{ __html: cms("subheading") }}
          />
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="text-lg px-10 font-Cairo font-playfair shadow-xl"
              asChild
            >
              <a href="#dashboard">{cms("ctaPrimary")}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Final Dual-CTA Showcase */}
      <section className="py-24 px-6 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Card 1: Revisions CTA */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex flex-col justify-center text-center p-12 md:p-16 rounded-[2.5rem] glass-panel border-primary/20 premium-border"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-foreground leading-[1.1]">
              {cms("finalHeading")}
            </h2>
            <div>
              <Button
                size="lg"
                variant="default"
                className="text-lg px-12 h-14 font-Cairo font-playfair shadow-2xl"
                asChild
              >
                <a href="/contact">{cms("finalCta")}</a>
              </Button>
            </div>
          </motion.div>

          {/* Card 2: E-commerce Showcase */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-[2.5rem] glass-panel border-white/10 premium-border flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden m-4 rounded-[1.5rem] border border-white/5">
              <img 
                src="/ecommerce_mockup.png" 
                alt="E-commerce Showcase"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            <div className="p-8 pt-2 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                {cms("ecommerceHeading")}
              </h2>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 h-14 font-Cairo font-playfair glass-panel premium-border hover:bg-primary hover:text-primary-foreground group-hover:shadow-[0_0_30px_rgba(var(--primary),0.3)]"
                asChild
              >
                <a href="/gallery">{cms("ecommerceCta")}</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
