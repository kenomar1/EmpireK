// src/pages/ServiceGalleryPage.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Globe,
  Code2,
  Smartphone,
  Search,
  Shield,
  ArrowRight,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Footer from "../components/layout/Footer";

interface ServiceConfig {
  key: string;
  icon: React.FC<any>;
  color: string;
  images: string[];
}

const SERVICE_CONFIG: ServiceConfig[] = [
  {
    key: "webDevelopment",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    images: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=800&fit=crop",
    ],
  },
  {
    key: "uiUx",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    images: [
      "https://images.unsplash.com/photo-1562577308-9e5e8f5a6b0b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559028006-44836d92b96f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1551650975-87de5e12a9b8?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1561070791-36a0e720ae27?w=1200&h=800&fit=crop",
    ],
  },
  {
    key: "cms",
    icon: Code2,
    color: "from-green-500 to-emerald-500",
    images: [
      "https://images.unsplash.com/photo-1547658719-da2bb8d5e2b3?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1551033406-6110c3f5b7b9?w=1200&h=800&fit=crop",
    ],
  },
  {
    key: "mobileApps",
    icon: Smartphone,
    color: "from-orange-500 to-red-500",
    images: [
      "https://images.unsplash.com/photo-1512941937669-90a6b5b83691?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1611224923853-80b023a89d0f?w=1200&h=800&fit=crop",
    ],
  },
  {
    key: "seo",
    icon: Search,
    color: "from-indigo-500 to-purple-500",
    images: [
      "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
    ],
  },
  {
    key: "maintenance",
    icon: Shield,
    color: "from-amber-500 to-orange-500",
    images: [
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1581093450021-4a7360e9c636?w=1200&h=800&fit=crop",
    ],
  },
];

export default function ServiceGalleryPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [activeTab, setActiveTab] = useState(0); // Index-based
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const currentService = SERVICE_CONFIG[activeTab];
  const Icon = currentService.icon;

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setSelectedImageIndex(0); // Reset image on tab change
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === currentService.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? currentService.images.length - 1 : prev - 1
    );
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-full text-primary font-semibold mb-6">
            <Icon className="w-6 h-6" />
            {t(`gallery.services.${currentService.key}.name`)}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t("gallery.heroTitle")}
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("gallery.heroSubtitle")}
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-4 gap-10">
          {/* Side Tabs */}
          <aside className="space-y-3">
            {SERVICE_CONFIG.map((service, index) => {
              const ServiceIcon = service.icon;
              const isActive = index === activeTab;

              return (
                <motion.button
                  key={service.key}
                  onClick={() => handleTabClick(index)}
                  whileHover={{ x: isRTL ? -8 : 8 }}
                  className={`w-full text-left p-5 rounded-2xl transition-all flex items-center gap-4 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-2xl ring-4 ring-primary/20"
                      : "bg-card hover:bg-accent/70 border border-border"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl ${
                      isActive ? "bg-white/20" : "bg-primary/10"
                    }`}
                  >
                    <ServiceIcon
                      className={`w-6 h-6 ${
                        isActive ? "text-white" : "text-primary"
                      }`}
                    />
                  </div>
                  <span className="font-semibold">
                    {t(`gallery.services.${service.key}.name`)}
                  </span>
                  {isActive && <ArrowRight className="ml-auto w-5 h-5" />}
                </motion.button>
              );
            })}
          </aside>

          {/* Gallery */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-3xl overflow-hidden bg-black/50 shadow-2xl"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  src={currentService.images[selectedImageIndex]}
                  alt={`${t(`gallery.services.${currentService.key}.name`)} ${
                    selectedImageIndex + 1
                  }`}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6 }}
                  className="w-full aspect-video object-cover"
                />
              </AnimatePresence>

              {/* Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                {currentService.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i === selectedImageIndex ? "bg-white w-10" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            <p className="text-center mt-6 text-muted-foreground font-medium">
              {selectedImageIndex + 1} / {currentService.images.length}
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <section className="px-6 py-24 bg-gradient-to-t from-primary/5 to-background">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black text-center mb-16"
          >
            {t("gallery.testimonialsTitle")}
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {(t("gallery.testimonials", { returnObjects: true }) as any[]).map(
              (testimonial: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-card/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-border/50"
                >
                  <Quote className="w-12 h-12 text-primary/20 mb-6" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        className="w-5 h-5 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-lg italic text-foreground/80 mb-8">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </div>

          <div className="text-center mt-16">
            <a
              href="/contact"
              className="inline-flex items-center gap-4 px-10 py-6 bg-primary text-primary-foreground rounded-full text-xl font-bold shadow-2xl hover:scale-105 transition-all duration-300"
            >
              {t("gallery.cta")} <ArrowRight className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
