// src/pages/BlogPage.tsx
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";

interface BlogPost {
  id: number;
  slug: string;
  category: keyof typeof categoryColors;
  readTime: number;
  date: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "future-of-web-development-2025",
    category: "webDevelopment",
    readTime: 6,
    date: "2025-03-15",
  },
  {
    id: 2,
    slug: "ui-ux-trends-2025",
    category: "uiUx",
    readTime: 8,
    date: "2025-02-28",
  },
  {
    id: 3,
    slug: "why-headless-cms-is-the-future",
    category: "cms",
    readTime: 5,
    date: "2025-02-10",
  },
  {
    id: 4,
    slug: "building-native-mobile-apps-react-native",
    category: "mobileApps",
    readTime: 10,
    date: "2025-01-20",
  },
  {
    id: 5,
    slug: "seo-strategies-that-actually-work",
    category: "seo",
    readTime: 7,
    date: "2025-01-05",
  },
  {
    id: 6,
    slug: "maintenance-tips-for-long-living-projects",
    category: "maintenance",
    readTime: 4,
    date: "2024-12-20",
  },
];

const categoryColors = {
  webDevelopment: "from-blue-500 to-cyan-500",
  uiUx: "from-purple-500 to-pink-500",
  cms: "from-green-500 to-emerald-500",
  mobileApps: "from-orange-500 to-red-500",
  seo: "from-indigo-500 to-purple-500",
  maintenance: "from-amber-500 to-orange-500",
} as const;

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-full text-primary font-semibold mb-6">
            <span className="tracking-wider">{t("blog.latest")}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t("blog.heroTitle")}
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("blog.heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.id}
              to={`/blogpost`}
              className="group bg-card rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-border/50 flex flex-col h-full"
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={`https://images.unsplash.com/photo-${
                    post.id + 1500000000
                  }?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80`}
                  alt={t(`blog.posts.${post.slug}.title`)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-7 flex flex-col flex-grow">
                {/* Category Badge */}
                <span
                  className={`inline-block w-fit px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r ${
                    categoryColors[post.category]
                  } text-white mb-4`}
                >
                  {t(`blog.categories.${post.category}`)}
                </span>

                {/* Title */}
                <h2 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {t(`blog.posts.${post.slug}.title`)}
                </h2>

                {/* Excerpt */}
                <p className="text-muted-foreground text-sm mb-6 flex-grow line-clamp-3">
                  {t(`blog.posts.${post.slug}.excerpt`)}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(post.date).toLocaleDateString(
                          i18n.language === "ar" ? "ar-EG" : "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>
                        {post.readTime} {t("blog.minRead")}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
