"use client";

import { useEffect, useState } from "react";
import {
  Globe,
  Palette,
  Code2,
  Search,
  Shield,
  ExternalLink,
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
  search: Search,
  shield: Shield,
};

type Category = {
  _id: string;
  title: string;
  icon: keyof typeof icons;
};

type Project = {
  _id: string;
  title: string;
  slug: { current: string };
  client?: string;
  year?: number;
  description?: string;
  mainImage?: { asset?: { url: string } };
  images?: Array<{ _key: string; asset?: { url: string }; caption?: string }>;
  link?: string;
  category?: Category | null;
};

type BlogPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: { asset?: { url: string } };
  publishedAt?: string;
};

export default function GalleryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projectsByCategory, setProjectsByCategory] = useState<
    Record<string, Project[]>
  >({});
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [highlightedPosts, setHighlightedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === "ar" ? "ar" : "en";
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    const query = `
      {
        "projects": *[_type == "project" && language == $lang] | order(_createdAt desc) {
          _id,
          title,
          slug,
          client,
          year,
          description,
          link,
          mainImage { asset-> { url } },
          images[] { _key, caption, asset-> { url } },
          "category": category-> { _id, title, icon }
        },
        "categories": *[_type == "category"] { _id, title, icon }
      }
    `;

    client
      .fetch<{ projects: Project[]; categories: Category[] }>(query, {
        lang: currentLang,
      })
      .then((data) => {
        const uniqueCategories = data.categories;
        const grouped: Record<string, Project[]> = {};
        data.projects.forEach((project) => {
          const catId = project.category?._id || "uncategorized";
          if (!grouped[catId]) grouped[catId] = [];
          grouped[catId].push(project);
        });

        setProjects(data.projects);
        setCategories(uniqueCategories);
        setProjectsByCategory(grouped);
        setActiveCategoryId(uniqueCategories[0]?._id || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [currentLang]);

  // Fetch highlighted blog posts for the active category
  useEffect(() => {
    if (!activeCategoryId) {
      setHighlightedPosts([]);
      return;
    }

    const postsQuery = `*[_type == "post" && isHighlighted == true && language == $lang && category._ref == $categoryId] | order(publishedAt desc) [0...6] {
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
  }, [activeCategoryId, currentLang]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("common.loading")}</p>
      </div>
    );
  if (projects.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("gallery.noProjects")}</p>
      </div>
    );

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-24 pb-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-5xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t("gallery.heroTitle", "Our Work Gallery")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t(
              "gallery.heroSubtitle",
              "Real projects delivered for real clients"
            )}
          </p>
        </motion.div>
      </section>

      {/* Category Tabs */}
      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6">
            {categories.map((category) => {
              const Icon = icons[category.icon] || Globe;
              const isActive = activeCategoryId === category._id;

              return (
                <motion.button
                  key={category._id}
                  onClick={() => setActiveCategoryId(category._id)}
                  whileHover={{ scale: 1.05 }}
                  className={`flex flex-col items-center gap-4 px-28 py-8 rounded-3xl font-bold text-lg shadow-xl transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-primary/40 ring-4 ring-primary/30"
                      : "bg-card text-foreground shadow-foreground/20 hover:bg-primary/20 hover:shadow-2xl"
                  }`}
                >
                  <div className="p-5 bg-white/20 rounded-2xl">
                    <Icon className="w-12 h-12" />
                  </div>
                  <span>{category.title}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeCategoryId && (
              <motion.div
                key={activeCategoryId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {(projectsByCategory[activeCategoryId] || []).map(
                  (project, i) => (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group bg-card rounded-3xl overflow-hidden shadow-xl hover:shadow-foreground/60 shadow-foreground/30 transition-all duration-500 "
                    >
                      {project.mainImage?.asset?.url ? (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={urlFor(project.mainImage)
                              .width(800)
                              .height(500)
                              .fit("crop")
                              .url()}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">
                            No image
                          </span>
                        </div>
                      )}

                      <div className="p-8">
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        {(project.client || project.year) && (
                          <p className="text-muted-foreground mb-4">
                            {project.client && <span>{project.client}</span>}
                            {project.client && project.year && " • "}
                            {project.year && <span>{project.year}</span>}
                          </p>
                        )}
                        {project.description && (
                          <p className="text-muted-foreground line-clamp-3 mb-6">
                            {project.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <Link
                            to={`/project/${project.slug.current}`}
                            className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                          >
                            {t("gallery.viewDetails")} →
                          </Link>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary/70 hover:text-primary flex items-center gap-2"
                            >
                              <ExternalLink className="w-5 h-5" />
                              Live
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Related Insights Section - Below Projects */}
      {highlightedPosts.length > 0 && (
        <section className="px-6 py-32 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                {t("gallery.relatedInsights", "Insights & Expertise")}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t(
                  "gallery.insightsSubtitle",
                  "Articles and thought leadership from this category"
                )}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {highlightedPosts.slice(0, 6).map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/blog/${post.slug.current}`}
                    className="group  bg-foreground text-background rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col "
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
                      <div className="aspect-video bg-muted/50 flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">
                          No image
                        </span>
                      </div>
                    )}

                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>
                      )}
                      {post.publishedAt && (
                        <div className="mt-auto flex items-center gap-2 text-sm text-muted-foreground">
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
    </div>
  );
}
