"use client";

import React, { useEffect, useState } from "react";
import {
  Globe,
  Palette,
  Code2,
  Store,
  Search,
  Shield,
  ArrowRight,
  CheckCircle2,
  Calendar,
  ChevronDown,
  LayoutGrid,
  Tag,
  CreditCard
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { client, urlFor } from "../lib/sanityClient";
import Footer from "../components/layout/Footer";

const icons = {
  globe: Globe,
  palette: Palette,
  code: Code2,
  store: Store,
  search: Search,
  shield: Shield,
};

type Category = {
  _id: string;
  title: string;
  icon: keyof typeof icons;
  colorGradient?: string;
};

type BlogPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: { asset?: { url: string } };
  publishedAt?: string;
};

type GalleryImage = {
  _key: string;
  alt?: string;
  caption?: string;
  asset?: { url: string };
};

type Service = {
  _id: string;
  _createdAt?: string;
  slug?: { current: string };
  name: string;
  title?: string;
  shortDesc?: string;
  features?: string[];
  galleryImages?: GalleryImage[];
  category?: Category | null;
};

type Product = {
  id: string;
  title: string;
  desc: string;
  price: string;
  type: "sale" | "subscription";
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "newest">("name");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [highlightedPosts, setHighlightedPosts] = useState<BlogPost[]>([]);
  const [allGalleryImages, setAllGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const { t, i18n } = useTranslation(["translation", "prices"]);
  const currentLang = i18n.language === "ar" ? "ar" : "en";
  const isRTL = i18n.language === "ar";

  const heroTitle = t("servicesPage.heroTitle");
  const heroSubtitle = t("servicesPage.heroSubtitle");
  const orderCta = t("servicesPage.orderCta");
  const priceValue = t("servicesPage.price");
  const timelineValue = t("servicesPage.timeline");

  const products = (t("servicesPage.productsList", { returnObjects: true }) as Product[]) || [];

  useEffect(() => {
    const query = `
      {
        "services": *[_type == "service" && language == $lang] {
          _id,
          _createdAt,
          name,
          slug,
          title,
          shortDesc,
          features,
          galleryImages[] {
            _key,
            alt,
            caption,
            asset-> { url }
          },
          "category": category-> {
            _id,
            title,
            icon,
            colorGradient
          }
        }
      }
    `;

    client
      .fetch<{ services: Service[] }>(query, { lang: currentLang })
      .then((data) => {
        const fetchedServices = data.services;

        const uniqueCategories = Array.from(
          new Map(
            fetchedServices
              .filter((s) => s.category)
              .map((s) => [s.category!._id, s.category!])
          ).values()
        );

        setServices(fetchedServices);
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setLoading(false);
      });
  }, [currentLang]);

  useEffect(() => {
    const filtered = activeCategoryId === "all" 
      ? services 
      : services.filter(s => s.category?._id === activeCategoryId);
    
    const gallery = filtered
      .flatMap((s) => s.galleryImages ?? [])
      .filter((img): img is GalleryImage => !!img);
    setAllGalleryImages(gallery);

    if (activeCategoryId !== "all") {
      const postsQuery = `*[_type == "post" && isHighlighted == true && language == $lang && category._ref == $categoryId] | order(publishedAt desc) [0...8] {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        "mainImage": mainImage.asset-> { url }
      }`;

      client
        .fetch<BlogPost[]>(postsQuery, {
          lang: currentLang,
          categoryId: activeCategoryId,
        })
        .then(setHighlightedPosts)
        .catch(() => setHighlightedPosts([]));
    } else {
      setHighlightedPosts([]);
    }
  }, [activeCategoryId, currentLang, services]);

  const sortedServices = [...services]
    .filter(s => activeCategoryId === "all" || s.category?._id === activeCategoryId)
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "newest") {
        return new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime();
      }
      return 0;
    });

  const getServicePrice = (slug?: string) => {
    if (!slug) return t("prices:services.base");
    const localizedPrice = t(`prices:services.${slug}`);
    return localizedPrice && !localizedPrice.startsWith("prices:services") ? localizedPrice : t("prices:services.base");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-40 px-6 relative overflow-hidden bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative max-w-5xl mx-auto text-center glass-panel premium-border p-12 rounded-[3.5rem] border-white/10"
        >
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight mb-8 text-foreground">
            {heroTitle}
          </h1>
          <p className="text-xl sm:text-2xl text-foreground/80 max-w-4xl mx-auto leading-relaxed font-medium">
            {heroSubtitle}
          </p>
        </motion.div>
      </section>

      {/* Controls: Segmented Picker & Sorting */}
      <section className="px-6 mb-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Segmented Category Picker */}
          <div className="relative p-2 glass-panel premium-border rounded-full flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setActiveCategoryId("all")}
              className={`relative px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 z-10 flex items-center gap-2 whitespace-nowrap ${
                activeCategoryId === "all" ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              {t("servicesPage.all")}
              {activeCategoryId === "all" && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-primary rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>

            {categories.map((category) => {
              const Icon = icons[category.icon];
              return (
                <button
                  key={category._id}
                  onClick={() => setActiveCategoryId(category._id)}
                  className={`relative px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 z-10 flex items-center gap-2 whitespace-nowrap ${
                    activeCategoryId === category._id ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {category.title}
                  {activeCategoryId === category._id && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-primary rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-3 px-6 py-4 glass-panel premium-border rounded-2xl font-bold hover:bg-white/5 transition-all"
            >
              <span className="text-muted-foreground">{t("servicesPage.sortBy")}:</span>
              <span className="text-foreground">{t(`servicesPage.sort${sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}`)}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-48 glass-panel premium-border rounded-2xl overflow-hidden z-50 shadow-2xl"
                >
                  <button
                    onClick={() => { setSortBy("name"); setIsSortOpen(false); }}
                    className={`w-full text-left px-6 py-4 transition-colors hover:bg-primary/20 ${sortBy === "name" ? "text-primary font-bold" : "text-foreground"}`}
                  >
                    {t("servicesPage.sortName")}
                  </button>
                  <button
                    onClick={() => { setSortBy("newest"); setIsSortOpen(false); }}
                    className={`w-full text-left px-6 py-4 transition-colors hover:bg-primary/20 ${sortBy === "newest" ? "text-primary font-bold" : "text-foreground"}`}
                  >
                    {t("servicesPage.sortNewest")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 mb-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            <AnimatePresence mode="popLayout">
              {sortedServices.map((service, index) => {
                const ServiceIcon = service.category?.icon
                  ? icons[service.category.icon] || Globe
                  : Globe;
                const dynamicPrice = getServicePrice(service.slug?.current);

                return (
                  <motion.div
                    key={service._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    className="glass-panel premium-border rounded-[2.5rem] hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col group"
                  >
                    <div className="p-10 flex-1 flex flex-col">
                      <div className="inline-flex p-6 bg-primary/10 rounded-[2rem] mb-8 w-fit text-primary">
                        <ServiceIcon className="w-12 h-12" />
                      </div>

                      <h3 className="text-3xl font-bold mb-6 group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>

                      <p className="text-muted-foreground text-lg mb-10 flex-1 leading-relaxed">
                        {service.shortDesc || "Professional service tailored to your needs."}
                      </p>

                      {service.features && service.features.length > 0 && (
                        <div className="space-y-4 mb-10">
                          {service.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                              <span className="text-base text-foreground/80">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <Link
                        to="/contact"
                        className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-primary text-primary-foreground rounded-full font-bold text-lg shadow-lg hover:bg-primary/90 hover:scale-[1.03] transition-all"
                      >
                        {orderCta}
                        <ArrowRight className="w-6 h-6" />
                      </Link>

                      <p className="text-center text-sm text-muted-foreground mt-4 italic font-medium">
                        {t("servicesPage.orderMeta", { price: dynamicPrice, timeline: timelineValue })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Digital Products Section */}
      <section className="px-6 mb-40 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              {t("servicesPage.digitalProductsTitle")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("servicesPage.digitalProductsSubtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {products.map((product, idx) => {
              const productPrice = t(`prices:products.${product.id}`);
              
              return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative glass-panel premium-border rounded-[3rem] overflow-hidden flex flex-col md:flex-row gap-6 p-6"
              >
                {/* Product Image Holder */}
                <div className="relative w-full md:w-2/5 aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/5 bg-accent/20">
                  <img 
                    src="file:///C:/Users/kendr/.gemini/antigravity/brain/c25d4434-ac93-4b5c-a01f-2a2899656964/ecommerce_mockup_premium_1766936056465.png" 
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  
                  {/* Badge */}
                  <div className="absolute top-6 left-6 px-4 py-2 rounded-full glass-panel premium-border bg-primary/20 backdrop-blur-md flex items-center gap-2">
                    {product.type === "sale" ? <Tag className="w-4 h-4 text-primary" /> : <CreditCard className="w-4 h-4 text-primary" />}
                    <span className="text-xs font-bold text-white uppercase tracking-widest leading-none">
                      {product.type === "sale" ? t("servicesPage.modelSale") : t("servicesPage.modelSubscription")}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 py-4 px-2 flex flex-col justify-center">
                  <h3 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                    {product.title}
                  </h3>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    {product.desc}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between gap-6">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm uppercase tracking-widest font-bold">
                        {t("services.price", "Price")}
                      </span>
                      <span className="text-3xl font-black text-foreground">
                        {productPrice}
                      </span>
                    </div>
                    
                    <Link
                      to="/contact"
                      className="px-8 py-4 bg-foreground text-background rounded-2xl font-bold hover:bg-primary hover:text-primary-foreground transition-all shadow-xl hover:shadow-primary/30"
                    >
                      {t("servicesPage.buyNow")}
                    </Link>
                  </div>
                </div>
              </motion.div>
            )})}
          </div>
        </div>
      </section>

      {/* Related Insights Section */}
      {highlightedPosts.length > 0 && (
        <section className="px-6 mb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                {t("services.relatedArticles", "Related Insights")}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t(
                  "services.insightsSubtitle",
                  "Latest articles from our experts"
                )}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {highlightedPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/blog/${post.slug.current}`}
                    className="group flex flex-col glass-panel premium-border rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 h-full p-2"
                  >
                    {post.mainImage?.asset?.url ? (
                      <div className="aspect-video overflow-hidden rounded-2xl">
                        <img
                          src={urlFor(post.mainImage)
                            .width(600)
                            .height(400)
                            .fit("crop")
                            .url()}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}

                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-3">
                        {post.excerpt || "Read more about this topic..."}
                      </p>
                      {post.publishedAt && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {allGalleryImages.length > 0 && (
        <section className="px-6 pb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                {t("services.pastWork", "Our Recent Work")}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t(
                  "services.gallerySubtitle",
                  "Projects we've delivered with pride"
                )}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allGalleryImages.map((img, index) => (
                <motion.div
                  key={img._key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-3xl shadow-xl group cursor-pointer glass-panel premium-border p-2"
                >
                  <div className="relative rounded-2xl overflow-hidden h-full">
                    <img
                      src={urlFor(img).width(600).height(600).url()}
                      alt={img.alt || img.caption || "Project"}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-medium text-center">
                          {img.caption}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
