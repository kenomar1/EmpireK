// src/pages/BlogPostPage.tsx
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Twitter,
  Linkedin,
  Link2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";

export default function BlogPostPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // Hard-coded post data (you'll replace this with DB later)
  const post = {
    title: "The Future of Web Development in 2025",
    category: "Web Development",
    categoryKey: "webDevelopment",
    date: "2025-03-15",
    readTime: 8,
    author: "Sarah Al-Mansouri",
    authorRole: "Senior Frontend Engineer",
    authorAvatar: "S", // First letter
    excerpt:
      "Explore emerging technologies like WebAssembly, AI-powered tooling, and edge computing that are reshaping how we build for the web.",
    content: `
      <p>In 2025, the web development landscape has evolved beyond recognition. What was once a simple combination of HTML, CSS, and JavaScript has transformed into a sophisticated ecosystem driven by performance, intelligence, and seamless user experiences.</p>

      <h2>The Rise of Edge-Native Applications</h2>
      <p>With edge computing now mainstream, applications are no longer bound by geographic latency. Platforms like Cloudflare Workers, Vercel Edge Functions, and Deno Deploy have made it possible to run full-stack applications milliseconds away from users — anywhere in the world.</p>

      <blockquote>
        “The edge isn't just faster — it's fundamentally changing how we think about architecture.” — Industry Leader, 2025
      </blockquote>

      <h2>AI-Powered Development Tools</h2>
      <p>Tools like GitHub Copilot X, Cursor, and local LLMs have moved from novelty to necessity. Developers now spend less time writing boilerplate and more time solving complex problems.</p>

      <ul>
        <li>90% reduction in component scaffolding time</li>
        <li>Real-time performance optimization suggestions</li>
        <li>Automated accessibility and security audits</li>
      </ul>

      <h2>WebAssembly: Beyond the Browser</h2>
      <p>WASM is no longer just for heavy computation in the browser. We're seeing full backend services written in Rust, running on the edge with near-native performance.</p>

      <h2>Conclusion</h2>
      <p>The future isn't about choosing between frameworks or tools — it's about building intelligent, fast, and globally distributed experiences that feel magical to users. The tools have caught up. Now it's our turn to imagine what's possible.</p>
    `,
    tags: [
      "Web Development",
      "Edge Computing",
      "AI",
      "Performance",
      "Future Tech",
    ],
    gradient: "from-blue-500 to-cyan-500",
  };

  const shareUrl = window.location.href;
  const shareTitle = encodeURIComponent(post.title);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <Link
          to="/blog"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          {isRTL ? "العودة إلى المدونة" : "Back to Blog"}
        </Link>
      </div>

      {/* Hero */}
      <section className="pt-10 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Category Badge */}
          <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-full text-primary font-bold mb-8">
            <div
              className={`w-3 h-3 rounded-full bg-gradient-to-r ${post.gradient}`}
            />
            {post.category}
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 mt-10 text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                {post.authorAvatar}
              </div>
              <div>
                <p className="font-bold text-foreground">{post.author}</p>
                <p className="text-sm">{post.authorRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(post.date).toLocaleDateString(
                    isRTL ? "ar-EG" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>
                  {post.readTime} {isRTL ? "دقيقة قراءة" : "min read"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-muted">
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop"
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-20">
        <div
          className="prose prose-lg dark:prose-invert max-w-none
                     [&_h2]:text-4xl [&_h2]:font-black [&_h2]:mt-16 [&_h2]:mb-6
                     [&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-foreground/80
                     [&_ul]:space-y-3 [&_li]:text-foreground/80
                     [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote]:text-foreground/90 [&_blockquote]:bg-primary/5 [&_blockquote]:my-10
                     [&_a]:text-primary [&_a]:underline [&_a]:font-medium"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Tags */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="flex flex-wrap gap-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-5 py-2 bg-muted/70 rounded-full text-sm font-medium text-muted-foreground border border-border/50"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Share Section */}
      <div className="max-w-5xl mx-auto px-6 pb-24 border-t border-border/50">
        <div className="py-12 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-2xl font-bold mb-2">
              {isRTL ? "شارك هذا المقال" : "Share this article"}
            </p>
            <p className="text-muted-foreground">
              {isRTL ? "ساعدنا في نشر المعرفة" : "Help us spread the knowledge"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="p-4 bg-card rounded-full hover:bg-accent transition-all hover:scale-110"
              title="Copy link"
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
              {isRTL ? "مشاركة" : "Share"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
