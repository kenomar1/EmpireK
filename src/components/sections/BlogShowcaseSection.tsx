// components/BlogGridShowcase.tsx
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
    <section className="py-32 px-6 bg-transparent" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-24 glass-panel premium-border p-12 rounded-[3rem] border-white/10"
        >
          <h2
            className="text-5xl md:text-8xl font-black tracking-tight text-foreground"
          >
            {t("blog.showcase.title")}
          </h2>

          <p
            className="mt-8 text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            {t("blog.showcase.subtitle")}
          </p>
        </motion.div>

        {/* Grid or Empty State */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              {t("blog.showcase.noPosts")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link
                  to={`/blog/${post.slug.current}`}
                  className="block h-full"
                >
                  <article className="h-full flex flex-col glass-panel rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 group-hover:border-primary/50">
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

                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p className="text-muted-foreground mb-6 line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>
                            {post.author?.name ||
                              t("blog.showcase.defaultAuthor")}
                          </span>
                        </div>

                        {post.publishedAt && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
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
          <div className="text-center mt-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-4 px-12 py-5 bg-primary/10 text-primary rounded-full text-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-400 shadow-lg hover:shadow-xl"
              >
                {t("blog.showcase.cta")}
                <ArrowRight className="w-6 h-6" />
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
