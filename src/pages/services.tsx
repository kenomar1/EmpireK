"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { client, urlFor } from "../lib/sanityClient";

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
  slug?: { current: string };
  name: string;
  title?: string;
  shortDesc?: string;
  features?: string[];
  galleryImages?: GalleryImage[];
  category?: Category | null;
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [servicesByCategory, setServicesByCategory] = useState<
    Record<string, Service[]>
  >({});
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [highlightedPosts, setHighlightedPosts] = useState<BlogPost[]>([]);
  const [allGalleryImages, setAllGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === "ar" ? "ar" : "en";
  const isRTL = i18n.language === "ar";

  const heroTitle = t("servicesPage.heroTitle");
  const heroSubtitle = t("servicesPage.heroSubtitle");
  const orderCta = t("servicesPage.orderCta");
  const priceValue = t("servicesPage.price");
  const timelineValue = t("servicesPage.timeline");
  const orderMeta = t("servicesPage.orderMeta", {
    price: priceValue,
    timeline: timelineValue,
  });

  useEffect(() => {
    const query = `
      {
        "services": *[_type == "service" && language == $lang] | order(name asc) {
          _id,
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

        const grouped: Record<string, Service[]> = {};
        fetchedServices.forEach((service) => {
          const catId = service.category?._id || "uncategorized";
          if (!grouped[catId]) grouped[catId] = [];
          grouped[catId].push(service);
        });

        setServices(fetchedServices);
        setCategories(uniqueCategories);
        setServicesByCategory(grouped);
        setActiveCategoryId(uniqueCategories[0]?._id || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setLoading(false);
      });
  }, [currentLang]);

  useEffect(() => {
    if (!activeCategoryId) return;

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

    const categoryServices = servicesByCategory[activeCategoryId] || [];
    const gallery = categoryServices
      .flatMap((s) => s.galleryImages ?? [])
      .filter((img): img is GalleryImage => !!img);
    setAllGalleryImages(gallery);
  }, [activeCategoryId, currentLang, servicesByCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (services.length === 0 || categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl text-muted-foreground">
          {t("services.noServices")}
        </p>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-60" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative max-w-5xl mx-auto text-center"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {heroTitle}
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {heroSubtitle}
          </p>
        </motion.div>
      </section>

      {/* Category Tabs */}
      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6">
            {categories.map((category) => {
              const CatIcon = icons[category.icon] || Globe;
              const isActive = activeCategoryId === category._id;

              return (
                <motion.button
                  key={category._id}
                  onClick={() => setActiveCategoryId(category._id)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex flex-col items-center gap-4 px-10 py-8 rounded-3xl font-bold text-lg transition-all duration-400 shadow-xl ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-primary/40 ring-4 ring-primary/30"
                      : "bg-card text-foreground hover:bg-accent hover:shadow-2xl"
                  }`}
                >
                  <div className="p-5 bg-white/20 rounded-2xl">
                    <CatIcon className="w-12 h-12" />
                  </div>
                  <span className="text-xl">{category.title}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Cards Grid */}
      <section className="px-6 mb-32">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeCategoryId && (
              <motion.div
                key={activeCategoryId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {(servicesByCategory[activeCategoryId] ?? []).map(
                  (service, index) => {
                    const ServiceIcon = service.category?.icon
                      ? icons[service.category.icon] || Globe
                      : Globe;

                    return (
                      <motion.div
                        key={service._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        className="bg-card rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col border-4 border-primary/30 ring-8 ring-primary/10"
                      >
                        <div className="p-10 text-center flex-1 flex flex-col">
                          <div className="inline-flex p-6 bg-primary/10 rounded-3xl mb-8 mx-auto">
                            <ServiceIcon className="w-20 h-20 text-primary" />
                          </div>

                          <h3 className="text-3xl font-bold mb-6">
                            {service.name}
                          </h3>

                          <p className="text-muted-foreground text-lg mb-10 flex-1">
                            {service.shortDesc ||
                              "Professional service tailored to your needs."}
                          </p>

                          {service.features && service.features.length > 0 && (
                            <div className="space-y-4 mb-10">
                              {service.features.map((feature, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-4"
                                >
                                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                                  <span className="text-base">{feature}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <Link
                            to="/contact"
                            className="mt-auto inline-flex items-center justify-center gap-3 px-8 py-5 bg-primary text-primary-foreground rounded-full font-bold text-lg shadow-lg hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
                          >
                            {orderCta}
                            <ArrowRight className="w-6 h-6" />
                          </Link>

                          <p className="text-center text-sm text-muted-foreground mt-4">
                            {orderMeta}
                          </p>
                        </div>
                      </motion.div>
                    );
                  }
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
                    className="group flex flex-col bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full"
                  >
                    {post.mainImage?.asset?.url ? (
                      <div className="aspect-video overflow-hidden">
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
                  className="relative overflow-hidden rounded-3xl shadow-xl group cursor-pointer"
                >
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
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
