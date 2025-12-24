// src/pages/BlogPostPage.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PortableText } from "@portabletext/react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Share2,
  Twitter,
  Linkedin,
  Link2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { client, urlFor } from "../lib/sanityClient";
import Footer from "../components/layout/Footer";

const ptComponents = {
  types: {
    image: ({ value }: any) => (
      <div className="my-16 rounded-3xl overflow-hidden shadow-2xl">
        <img
          src={urlFor(value).width(1600).height(900).fit("crop").url()}
          alt={value.alt || "Blog post image"}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    ),
    code: ({ value }: any) => (
      <div className="relative my-12">
        <pre className="bg-gray-900 text-gray-100 p-8 rounded-2xl overflow-x-auto text-sm font-mono">
          <code>{value.code}</code>
        </pre>
        {value.language && (
          <span className="absolute top-4 right-4 px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full uppercase">
            {value.language}
          </span>
        )}
      </div>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline font-medium hover:text-primary/80 transition"
      >
        {children}
      </a>
    ),
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-4xl font-black mt-16 mb-6">{children}</h2>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-8 py-6 italic text-foreground/90 bg-primary/5 rounded-r-2xl my-10 text-lg">
        {children}
      </blockquote>
    ),
  },
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === "ar" ? "ar" : "en";
  const isRTL = i18n.language === "ar";

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const query = `*[_type == "post" && slug.current == $slug && language == $lang][0]{
      title,
      excerpt,
      mainImage,
      publishedAt,
      body,
      tags,
      category,
      author->{
        name,
        role,
        avatar
      },
      "readTime": round(length(pt::text(body)) / 600 + 1)
    }`;

    client
      .fetch(query, { slug, lang: currentLang })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        setLoading(false);
      });
  }, [slug, currentLang]); // ← Re-run when slug or language changes

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl text-muted-foreground">
        {t("blog.loadingArticle", "Loading article...")}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl text-red-500">
        {t("blog.postNotFound", "Post not found")}
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareTitle = encodeURIComponent(post.title);
  const pageTitle = t("blog.postTitleTemplate", "{{title}} | EmpireK", {
    title: post.title,
  });
  const pageDesc =
    post.excerpt ||
    t(
      "blog.defaultPostDesc",
      "Read this insightful article from our agency blog."
    );

  return (
    <>
      {/* === NATIVE SEO (React 19) === */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={shareUrl} />
      {post.mainImage && (
        <meta
          property="og:image"
          content={urlFor(post.mainImage).width(1200).height(630).url()}
        />
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={pageDesc} />
      {post.mainImage && (
        <meta
          name="twitter:image"
          content={urlFor(post.mainImage).width(1200).height(630).url()}
        />
      )}

      {/* === Structured Data (JSON-LD) === */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: pageDesc,
          image: post.mainImage ? urlFor(post.mainImage).url() : undefined,
          datePublished: post.publishedAt,
          author: {
            "@type": "Person",
            name: post.author?.name || t("blog.defaultAuthor", "EmpireK Team"),
          },
        })}
      </script>

      <div
        className="min-h-screen bg-gradient-to-br font-Cairo font-playfair from-background via-muted/20 to-background"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Hero */}
        <section className="pt-10 pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Category Badge */}

            {/* Title */}
            <h1 className="text-5xl mt-5 md:text-7xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 mt-10 text-muted-foreground">
              {/* Author */}
              <div className="flex items-center gap-4">
                {post.author?.avatar ? (
                  <img
                    src={urlFor(post.author.avatar)
                      .width(100)
                      .height(100)
                      .url()}
                    alt={post.author.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {post.author?.name?.charAt(0) || "?"}
                  </div>
                )}
                <div>
                  <p className="font-bold text-foreground">
                    {post.author?.name ||
                      t("blog.defaultAuthor", "EmpireK Team")}
                  </p>
                  <p className="text-sm">
                    {post.author?.role ||
                      t("blog.defaultRole", "Expert Developers")}
                  </p>
                </div>
              </div>

              {/* Date + Read Time */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>
                    {post.readTime} {t("blog.minRead", "min read")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {post.mainImage && (
          <div className="max-w-5xl mx-auto px-6">
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-muted">
              <img
                src={urlFor(post.mainImage)
                  .width(1600)
                  .height(900)
                  .fit("crop")
                  .url()}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-6 py-20">
          <div className="prose prose-lg  dark:prose-invert max-w-none text-foreground/80">
            <div>
              <PortableText value={post.body} components={ptComponents} />
            </div>
          </div>
        </article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="max-w-5xl mx-auto px-6 pb-16">
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag: string) => (
                <Link
                  key={tag}
                  to={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-5 font-mono py-2 bg-muted/70 rounded-full text-sm font-medium text-muted-foreground border border-border/50 hover:bg-accent hover:text-accent-foreground transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="max-w-5xl mx-auto px-6 pb-24 border-t border-border/50">
          <div className="py-12 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-2xl font-bold mb-2">
                {t("blog.shareArticle", "Share this article")}
              </p>
              <p className="text-muted-foreground">
                {t("blog.spreadKnowledge", "Help us spread the knowledge")}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="p-4 bg-card rounded-full hover:bg-accent transition-all hover:scale-110"
                title={t("blog.copyLink", "Copy link")}
              >
                <Link2 className="w-6 h-6" />
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-card rounded-full hover:bg-accent transition-all hover:scale-110"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-card rounded-full hover:bg-accent transition-all hover:scale-110"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <button className="p-4 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-all flex items-center gap-3 font-bold">
                <Share2 className="w-6 h-6" />
                {t("blog.share", "Share")}
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}