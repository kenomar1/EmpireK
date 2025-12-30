// src/pages/Blog.tsx
"use client"; // If using Next.js App Router; remove if using pages router with React Router

import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { client, urlFor } from "../lib/sanityClient";
import { useTheme } from "../context/ThemeContext"; 
import Footer from "../components/layout/Footer";

interface Category {
  title?: string;
  colorGradient?: string;
}

interface Author {
  name?: string;
  role?: string;
  avatar?: any;
}

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  publishedAt: string;
  tags?: string[];
  readTime: number;
  author?: Author;
  category?: Category;
}

export default function Blog() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme(); // "light" or "dark"
  const currentLang = i18n.language === "ar" ? "ar" : "en";

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const query = `*[_type == "post" && language == $lang] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      tags,
      "readTime": round(length(pt::text(body)) / 600 + 1),
      author->{
        name,
        role,
        avatar
      },
      category->{
        title,
        colorGradient
      }
    }`;

    client
      .fetch(query, { lang: currentLang })
      .then((data: Post[]) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
  }, [currentLang]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-muted-foreground">
          {t("blog.loading", "Loading posts...")}
        </p>
      </div>
    );
  }

  return (
    <>
      <title>{t("blog.pageTitle")}</title>
      <meta
        name="description"
        content={t(
          "blog.pageDescription",
          "Explore expert articles, tutorials, and case studies on modern web development, performance, design, and agency growth."
        )}
      />



      {/* Blog Content */}
      <div className="relative min-h-screen pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-24 glass-panel premium-border p-12 rounded-[2.5rem]">
            <h1 className="text-[2.5rem] sm:text-5xl md:text-8xl font-black tracking-tighter text-foreground font-BBHBogle">
              {t("blog.heroTitle", "Our Blog")}
            </h1>
            <p className="mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto font-medium leading-relaxed">
              {t(
                "blog.heroSubtitle",
                "Insights, tutorials, and thoughts on modern web development, design, performance, and agency life."
              )}
            </p>
          </div>

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p
                className={`text-2xl ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}
              >
                {t(
                  "blog.noPosts",
                  "No posts yet. Time to write your first one in Sanity Studio! 🚀"
                )}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 p-6 rounded-xl bg-transparent">
              {posts.map((post) => {
                const categoryTitle = post.category?.title;

                return (
                  <Link
                    key={post._id}
                    to={`/blog/${post.slug.current}`}
                    className="group glass-panel premium-border rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full border-white/10 p-2"
                  >
                    {/* Featured Image */}
                    {post.mainImage ? (
                      <div className="aspect-video overflow-hidden bg-muted rounded-2xl">
                        <img
                          src={urlFor(post.mainImage)
                            .width(800)
                            .height(500)
                            .fit("crop")
                            .url()}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <p className="text-3xl font-bold text-primary/50">
                          {t("blog.noImage", "No Image")}
                        </p>
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex-1">
                        <h2
                          className={`text-2xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                        >
                          {post.title}
                        </h2>

                        {post.excerpt && (
                          <p className="line-clamp-3 mb-6 text-foreground/70">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Author + Date + Read Time */}
                        <div
                          className={`flex flex-wrap items-center gap-4 text-sm mb-8 ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}
                        >
                          {post.author?.name && (
                            <span
                              className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                            >
                              {post.author.name}
                            </span>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(post.publishedAt), "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {post.readTime} {t("blog.minRead", "min read")}
                          </div>
                        </div>
                      </div>

                      {/* Category + Tags */}
                      {(categoryTitle ||
                        (post.tags && post.tags.length > 0)) && (
                        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/30">
                          {categoryTitle && (
                            <span
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-primary/30 via-parimary/5 to-primary/1`}
                            >
                              <div className="w-2 h-2 rounded-full bg-white/70" />
                              {categoryTitle}
                            </span>
                          )}

                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map((tag: string) => (
                                <span
                                  key={tag}
                                  className={`px-3 py-1 text-xs font-medium rounded-full border ${
                                    theme === "dark"
                                      ? "bg-white/10 border-white/30 text-white/80"
                                      : "bg-gray-100 border-gray-300 text-gray-700"
                                  }`}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
