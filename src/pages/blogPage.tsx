// src/pages/Blog.tsx (Fixed & Updated for Category References)

import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { client, urlFor } from "../lib/sanityClient";

interface Category {
  title?: string;
  colorGradient?: string; // e.g., "from-blue-500 to-cyan-500"
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

  // Fallback gradient if category has no colorGradient defined
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

      <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background py-16 px-6 font-Cairo font-playfair">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-primary">
              {t("blog.heroTitle", "Our Blog")}
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
              {t(
                "blog.heroSubtitle",
                "Insights, tutorials, and thoughts on modern web development, design, performance, and agency life."
              )}
            </p>
          </div>

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-muted-foreground">
                {t(
                  "blog.noPosts",
                  "No posts yet. Time to write your first one in Sanity Studio! 🚀"
                )}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post) => {
                const gradient =
                  post.category?.colorGradient || fallbackGradient;
                const categoryTitle = post.category?.title;

                return (
                  <Link
                    key={post._id}
                    to={`/blog/${post.slug.current}`}
                    className="group bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col h-full"
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
                        <h2 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>

                        {post.excerpt && (
                          <p className="text-muted-foreground line-clamp-3 mb-6">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Author + Date + Read Time */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                          {post.author?.name && (
                            <span className="font-medium text-foreground">
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

                      {/* Bottom: Category + Tags */}
                      {(categoryTitle ||
                        (post.tags && post.tags.length > 0)) && (
                        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/30">
                          {categoryTitle && (
                            <span
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${gradient}`}
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
                                  className="px-3 py-1 text-xs font-medium bg-muted/70 rounded-full border border-border/50 text-muted-foreground"
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
