// src/components/ui/CMSDemoPage.tsx
"use client";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CMSDemoSection() {
  const { i18n, t } = useTranslation();
  const cms = (key, options) => t(`cmsDemo.${key}`, options);

  const isRTL = i18n.language === "ar";

  return (
    <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-transparent pt-32 pb-12">
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10 p-16 md:p-20 lg:p-24 rounded-3xl glass-panel">
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
              <a href="#" target="_blank" rel="noopener noreferrer">{cms("ctaPrimary")}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Final E-commerce Showcase */}
      <section className="pt-12 pb-8 px-6 bg-transparent relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* E-commerce Showcase Card */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="group relative overflow-hidden rounded-[2.5rem] glass-panel border-white/10 premium-border flex flex-col"
          >
            <div className="relative aspect-[21/9] overflow-hidden m-4 rounded-[1.5rem] border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
                alt="E-commerce Showcase"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            <div className="p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
                {cms("ecommerceHeading")}
              </h2>
              <Button
                size="lg"
                variant="outline"
                className="text-xl px-12 h-16 font-Cairo font-playfair glass-panel premium-border hover:bg-primary hover:text-primary-foreground group-hover:shadow-[0_0_40px_rgba(var(--primary),0.3)]"
                asChild
              >
                <Link to="/services#templates">{cms("ecommerceCta")}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
