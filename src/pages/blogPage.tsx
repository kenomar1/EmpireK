// src/pages/Blog.tsx
"use client"; // If using Next.js App Router; remove if using pages router with React Router

import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { client, urlFor } from "../lib/sanityClient";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { useTheme } from "../context/ThemeContext"; // Adjust path if needed

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

  // Same backgrounds as in HeroPromo
  const darkUrl =
    "https://shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.3&cAzimuthAngle=250&cDistance=1.5&cPolarAngle=140&cameraZoom=12.5&color1=%230E001A&color2=%23A12EFF&color3=%235A00A3&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.5&rotationX=0&rotationY=0&rotationZ=140&shader=defaults&type=sphere&uAmplitude=7&uDensity=0.8&uFrequency=5.5&uSpeed=0.3&uStrength=0.4&uTime=0&wireframe=false";

  // Light mode background – soft, bright, elegant (customize further on shadergradient.co)
  const lightUrl =
    "https://shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=3&cAzimuthAngle=250&cDistance=1.5&cPolarAngle=140&cameraZoom=12.5&color1=%23410075&color2=%23ffffff&color3=%23ffffff&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.5&rotationX=0&rotationY=0&rotationZ=140&shader=defaults&type=sphere&uAmplitude=7&uDensity=0.8&uFrequency=5.5&uSpeed=0.3&uStrength=0.4&uTime=0&wireframe=false";

  const backgroundUrl = theme === "dark" ? darkUrl : lightUrl;

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

  const fallbackGradient = "from-gray-500 to-gray-700";

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
      <title>
        {t(
          "blog.pageTitle",
          "Blog | EmpireK - Insights on Web Development & Design"
        )}
      </title>
      <meta
        name="description"
        content={t(
          "blog.pageDescription",
          "Explore expert articles, tutorials, and case studies on modern web development, performance, design, and agency growth."
        )}
      />

      {/* Full-Screen Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <ShaderGradientCanvas
          className="absolute inset-0"
          style={{ pointerEvents: "none" }}
        >
          <ShaderGradient
            control="query"
            urlString={backgroundUrl}
            key={theme} // Remount on theme change for smooth switch
          />
        </ShaderGradientCanvas>
      </div>

      {/* Blog Content */}
      <div className="relative min-h-screen pt-5  py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20">
            <h1
              className={`text-5xl md:text-7xl font-bold tracking-tighter ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              {t("blog.heroTitle", "Our Blog")}
            </h1>
            <p
              className={`mt-6 text-xl max-w-3xl mx-auto ${theme === "dark" ? "text-white/80" : "text-gray-700"}`}
            >
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 p-6 rounded-xl bg-background/40 shadow-lg shadow-background  backdrop-blur-sm">
              {posts.map((post) => {
                const gradient =
                  post.category?.colorGradient || fallbackGradient;
                const categoryTitle = post.category?.title;

                return (
                  <Link
                    key={post._id}
                    to={`/blog/${post.slug.current}`}
                    className={`
                      group rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col h-full
                      ${
                        theme === "dark"
                          ? "bg-background/30 border-white/20"
                          : "bg-background/60 border-black/20"
                      } backdrop-blur-md border
                    `}
                  >
                    {/* Featured Image */}
                    {post.mainImage ? (
                      <div className="aspect-video overflow-hidden bg-muted">
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
                          <p
                            className={`line-clamp-3 mb-6 ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}
                          >
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
    </>
  );
}
