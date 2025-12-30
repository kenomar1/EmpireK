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
      <section className="relative overflow-hidden bg-transparent py-16 md:py-24 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Column 1: CMS Text content */}
          <div className="text-center lg:text-start space-y-8 glass-panel p-10 md:p-16 rounded-[2.5rem] border-white/5">
            <Badge className="mb-2" variant="secondary">
              {cms("badge")}
            </Badge>
            <h2 className="text-5xl md:text-6xl font-Cairo font-black tracking-tight text-foreground leading-[1.1]">
              {cms("heading")}
            </h2>
            <p
              className="text-lg md:text-xl text-foreground/80 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0"
              dangerouslySetInnerHTML={{ __html: cms("subheading") }}
            />
            <div className="pt-4 flex justify-center lg:justify-start">
              <Button
                size="lg"
                className="text-lg px-10 h-14 font-Cairo font-bold shadow-xl rounded-2xl"
                asChild
              >
                <a href="#" target="_blank" rel="noopener noreferrer">{cms("ctaPrimary")}</a>
              </Button>
            </div>
          </div>

          {/* Column 2: E-commerce Showcase Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-[2.5rem] glass-panel border-white/10 premium-border flex flex-col shadow-2xl"
          >
            <div className="relative aspect-[16/10] lg:aspect-square xl:aspect-[16/10] overflow-hidden m-4 rounded-[1.5rem] border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
                alt="E-commerce Showcase"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Overlay Content on Hover */}
              <div className="absolute inset-x-0 bottom-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 hidden md:block">
                 <p className="text-white/80 font-medium mb-4">{cms("ecommerceHeading")}</p>
                 <Button variant="secondary" className="w-full h-12 rounded-xl font-bold" asChild>
                    <Link to="/services#templates">{cms("ecommerceCta")}</Link>
                 </Button>
              </div>
            </div>
            
            <div className="p-8 pt-2 text-center md:hidden lg:block xl:hidden">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                {cms("ecommerceHeading")}
              </h2>
              <Button
                size="lg"
                variant="outline"
                className="w-full h-14 font-Cairo font-bold glass-panel premium-border hover:bg-primary hover:text-primary-foreground transition-all"
                asChild
              >
                <Link to="/services#templates">{cms("ecommerceCta")}</Link>
              </Button>
            </div>

            {/* Default visible content for tablet/desktop where hover might not be intuitive or enough */}
            <div className="hidden md:flex lg:hidden xl:flex flex-col p-8 pt-2 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                {cms("ecommerceHeading")}
              </h2>
              <Button
                size="lg"
                variant="outline"
                className="w-full h-14 font-Cairo font-bold glass-panel premium-border hover:bg-primary hover:text-primary-foreground transition-all"
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
