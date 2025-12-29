// components/sections/BlogShowcaseSection.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { client, urlFor } from "../../lib/sanityClient";

type BlogPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  publishedAt?: string;
  author?: { name?: string };
};

export default function BlogGridShowcase() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const currentLang = i18n.language || "en";

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = `*[_type == "post" && defined(slug.current) && language == $lang] | order(publishedAt desc) [0...9] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      author-> { name }
    }`;

    setLoading(true);
    client
      .fetch(query, { lang: currentLang })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog posts:", err);
        setLoading(false);
      });
  }, [currentLang]);

  if (loading) {
    return (
      <section className="py-32 px-6 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-2xl text-muted-foreground">{t("blog.loading")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 bg-transparent" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="glass-panel premium-border p-8 md:p-12 rounded-[3rem] border-white/10"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              {t("blog.showcase.title")}
            </h2>

            <p className="mt-6 text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed font-medium">
              {t("blog.showcase.subtitle")}
            </p>
          </div>

          {/* Grid or Empty State */}
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                {t("blog.showcase.noPosts")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <Link
                    to={`/blog/${post.slug.current}`}
                    className="block h-full"
                  >
                    <article className="h-full flex flex-col bg-background/40 backdrop-blur-sm rounded-3xl overflow-hidden hover:bg-background/60 transition-all duration-300 border border-white/5 hover:border-primary/20">
                      {post.mainImage ? (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={urlFor(post.mainImage)
                              .width(800)
                              .height(500)
                              .fit("crop")
                              .url()}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-muted flex items-center justify-center">
                          <p className="text-muted-foreground text-lg">
                            {t("blog.showcase.noImage")}
                          </p>
                        </div>
                      )}

                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>

                        {post.excerpt && (
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                            {post.excerpt}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            <span>
                              {post.author?.name ||
                                t("blog.showcase.defaultAuthor")}
                            </span>
                          </div>

                          {post.publishedAt && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              <time>
                                {new Date(post.publishedAt).toLocaleDateString()}
                              </time>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA */}
          {posts.length > 0 && (
            <div className="text-center mt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-4 px-12 py-4 bg-primary text-primary-foreground rounded-full text-lg font-bold hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  {t("blog.showcase.cta")}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
