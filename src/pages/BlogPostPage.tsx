"use client";

import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { PortableText } from "@portabletext/react";
import { format } from "date-fns";
import { MessageSquare, Reply, ChevronDown, ChevronUp, User, Calendar, Clock, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { client, urlFor } from "../lib/sanityClient";
import Footer from "../components/layout/Footer";

const ptComponents = {
  types: {
    image: ({ value }: any) => (
      <div className="my-16 rounded-3xl overflow-hidden shadow-2xl">
        <img
          src={urlFor(value).width(1200).height(675).fit("crop").url()}
          alt={value.alt || "Blog post image"}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    ),
  },
};

type Post = {
  _id: string;
  title: string;
  body: any[];
  mainImage?: any;
  author?: { name?: string; role?: string; avatar?: any };
  publishedAt?: string;
  excerpt?: string;
  readTime: number;
  tags?: string[];
  category?: { title: string };
};

type Comment = {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
  parent?: { _ref: string; name: string } | null;
  replyCount?: number;
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const currentLang = i18n.language || "en";

  const [post, setPost] = useState<Post | null>(null);
  const [topLevelComments, setTopLevelComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commentsPerPage = 15;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const replyingToName = topLevelComments.find((c) => c._id === replyTo)?.name;

  const fetchData = async () => {
    if (!slug) return;
    setLoading(true);
    setTopLevelComments([]);
    setPage(1);

    try {
      const fetchedPost = await client.fetch<Post | null>(
        `*[_type == "post" && slug.current == $slug && language == $lang][0]{
          _id, title, excerpt, mainImage, publishedAt, body, tags,
          "readTime": round(length(pt::text(body)) / 600 + 1),
          author-> { name, role, avatar }, 
          category-> { title }
        }`,
        { slug, lang: currentLang }
      );

      if (!fetchedPost) {
        toast.error(t("blog.postNotFound"));
        setLoading(false);
        return;
      }

      setPost(fetchedPost);

      const firstComments = await client.fetch<Comment[]>(
        `*[_type == "comment" && post._ref == $postId && !defined(parent)]
        | order(createdAt desc) [0...${commentsPerPage}] {
          _id, name, message, createdAt,
          parent-> { _ref, name },
          "replyCount": count(*[_type == "comment" && parent._ref == ^._id])
        }`,
        { postId: fetchedPost._id }
      );

      setTopLevelComments(firstComments);
      setHasMore(firstComments.length === commentsPerPage);
      setPage(2);
    } catch (err) {
      console.error(err);
      toast.error(t("blog.errorFetching"));
    } finally {
      setLoading(false);
    }
  };

  const loadMoreComments = async () => {
    if (!post || loadingMore || !hasMore) return;
    setLoadingMore(true);

    const start = (page - 1) * commentsPerPage;
    const moreComments = await client.fetch<Comment[]>(
      `*[_type == "comment" && post._ref == $postId && !defined(parent)]
      | order(createdAt desc) [${start}...${start + commentsPerPage}] {
        _id, name, message, createdAt,
        parent-> { _ref, name },
        "replyCount": count(*[_type == "comment" && parent._ref == ^._id])
      }`,
      { postId: post._id }
    );

    setTopLevelComments((prev) => [...prev, ...moreComments]);
    setHasMore(moreComments.length === commentsPerPage);
    setPage((prev) => prev + 1);
    setLoadingMore(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !post ||
      isSubmitting ||
      !newComment.name.trim() ||
      !newComment.message.trim()
    )
      return;

    const tempId = `temp-${Date.now()}`;
    const now = new Date().toISOString();
    const optimisticComment: Comment = {
      _id: tempId,
      name: newComment.name.trim(),
      message: newComment.message.trim(),
      createdAt: now,
      parent: replyTo
        ? { _ref: replyTo, name: replyingToName || "someone" }
        : null,
      replyCount: 0,
    };

    if (!replyTo) {
      setTopLevelComments((prev) => [optimisticComment, ...prev]);
    }

    setIsSubmitting(true);
    setNewComment({ name: "", email: "", message: "" });
    setReplyTo(null);

    try {
      const created = await client.create({
        _type: "comment",
        post: { _type: "reference", _ref: post._id },
        name: newComment.name.trim(),
        email: newComment.email.trim(),
        message: newComment.message.trim(),
        createdAt: now, // Ensures accurate date
        ...(replyTo && { parent: { _type: "reference", _ref: replyTo } }),
      });

      toast.success(t("blog.commentSubmitted"));

      setTopLevelComments((prev) =>
        prev.map((c) => (c._id === tempId ? { ...c, _id: created._id } : c))
      );

      // Refresh on reply to update counts and deep tree
      if (replyTo) {
        fetchData();
      }
    } catch (err) {
      toast.error(t("blog.commentError"));
      setTopLevelComments((prev) => prev.filter((c) => c._id !== tempId));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyTo(commentId);
    setTimeout(() => {
      document.querySelector("textarea")?.focus();
    }, 100);
  };

  useEffect(() => {
    fetchData();
  }, [slug, currentLang]);

  useEffect(() => {
    if (!loadMoreRef.current || loadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreComments();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadingMore, hasMore, post]);

  if (loading) return <PostSkeleton />;
  if (!post)
    return (
      <div className="py-20 text-center text-2xl text-red-500">
        {t("blog.postNotFound")}
      </div>
    );

  return (
    <div className="min-h-screen bg-transparent" dir={isRTL ? "rtl" : "ltr"}>
      {post && (
        <>
          <title>{`${post.title} | ${t("common.brandName")}`}</title>
          <meta name="description" content={post.excerpt || post.title} />
        </>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-transparent pt-32 pb-16">
        <div className="container relative mx-auto px-6 max-w-[95vw] text-center">
          {/* Photo Card (Layered Under) */}
          {post.mainImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="glass-panel premium-border p-4 rounded-[4rem] shadow-2xl relative z-0 mx-auto max-w-7xl"
            >
              <div className="relative rounded-[3.5rem] overflow-hidden aspect-[21/9]">
                <img
                  src={urlFor(post.mainImage).width(1920).height(1080).url()}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
              </div>
            </motion.div>
          )}

          {/* Title Card (Layered Above) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel premium-border p-6 md:p-20 rounded-[2.5rem] md:rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative z-10 -mt-24 md:-mt-40 max-w-7xl mx-auto flex flex-col items-center gap-10 border-white/10"
          >
            {/* Meta Chips */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-bold uppercase tracking-widest text-primary">
              {post.category?.title && (
                <span className="px-6 py-2.5 rounded-full border border-primary/20 bg-primary/5">
                  {post.category.title}
                </span>
              )}
              {post.publishedAt && (
                <span className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-foreground/70">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(post.publishedAt), "MMM d, yyyy")}
                </span>
              )}
              <span className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-foreground/70">
                <Clock className="w-4 h-4" />
                {post.readTime} {t("blog.minRead", "Min Read")}
              </span>
            </div>

            <h1 className="text-5xl font-black md:text-9xl tracking-tighter leading-[0.95] text-foreground font-BBHBogle">
              {post.title}
            </h1>

            {/* Author Info */}
            {post.author && (
              <div className="flex items-center gap-6 mt-4">
                {post.author.avatar ? (
                  <img
                    src={urlFor(post.author.avatar).width(120).height(120).url()}
                    alt={post.author.name}
                    className="w-16 h-16 rounded-full border-2 border-primary/30"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                )}
                <div className="text-left">
                  <p className="font-bold text-xl text-foreground">{post.author.name}</p>
                  <p className="text-sm text-foreground/60 tracking-wider uppercase font-medium">{post.author.role || t("blog.author")}</p>
                </div>
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3">
                {post.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-foreground/50 transition-colors hover:border-primary/50 hover:text-foreground">
                    <Tag className="w-3.5 h-3.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Article Body */}
      <article className="container mx-auto max-w-5xl px-2 md:px-6 py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel premium-border p-4 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-xl"
        >
          {post.excerpt && (
            <p className="mb-8 md:mb-12 text-xl md:text-2xl text-foreground font-medium leading-relaxed italic opacity-90">{post.excerpt}</p>
          )}
          <div className="prose md:prose-lg md:prose-xl dark:prose-invert max-w-none text-foreground leading-loose [&_li::marker]:text-primary">
            <PortableText value={post.body} components={ptComponents} />
          </div>
        </motion.div>
      </article>

      {/* Comments Section */}
      <section className="container mx-auto border-t border-border px-6 py-16">
        <h2 className="mb-16 flex items-center gap-4 text-4xl md:text-5xl font-black">
          <MessageSquare className="h-10 w-10 text-primary" />
          {t("blog.comments")}
        </h2>

        {/* Comment Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-16 rounded-[2.5rem] glass-panel premium-border p-10 shadow-2xl"
        >
          <h3 className="mb-8 text-3xl font-bold">
            {replyTo ? t("blog.replyToComment") : t("blog.leaveComment")}
          </h3>
          {replyTo && replyingToName && (
            <div className="mb-4 rounded-lg bg-primary/10 px-4 py-2 text-sm text-primary">
              Replying to <strong>@{replyingToName}</strong>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <input
              type="text"
              placeholder={t("blog.namePlaceholder")}
              value={newComment.name}
              onChange={(e) =>
                setNewComment({ ...newComment, name: e.target.value })
              }
              required
              disabled={isSubmitting}
              className="rounded-xl border border-border bg-background/50 p-5 focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 transition-all"
            />
            <input
              type="email"
              placeholder={t("blog.emailPlaceholder")}
              value={newComment.email}
              onChange={(e) =>
                setNewComment({ ...newComment, email: e.target.value })
              }
              required
              disabled={isSubmitting}
              className="rounded-xl border border-border bg-background/50 p-5 focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 transition-all"
            />
          </div>

          <textarea
            placeholder={t("blog.messagePlaceholder")}
            value={newComment.message}
            onChange={(e) =>
              setNewComment({ ...newComment, message: e.target.value })
            }
            required
            rows={5}
            disabled={isSubmitting}
            className="mt-6 w-full rounded-xl border border-border bg-background/50 p-5 focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 transition-all resize-none"
          />

          <div className="mt-6 flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-primary px-10 py-5 font-bold text-lg text-primary-foreground shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t("blog.submitting") : t("blog.submit")}
            </button>
            {replyTo && (
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                disabled={isSubmitting}
                className="text-muted-foreground underline disabled:opacity-50"
              >
                {t("blog.cancelReply")}
              </button>
            )}
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-12">
          {topLevelComments.length === 0 && !loadingMore ? (
            <p className="text-center text-muted-foreground">
              {t("blog.noComments")}
            </p>
          ) : (
            topLevelComments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                onReply={handleReply}
                t={t}
                depth={0}
              />
            ))
          )}
          {loadingMore && <CommentSkeleton count={3} />}
          {hasMore && <div ref={loadMoreRef} className="h-10" />}
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Fully fixed CommentItem — deep nesting works perfectly
const CommentItem: React.FC<{
  comment: Comment;
  onReply: (id: string) => void;
  t: any;
  depth: number;
}> = ({ comment, onReply, t, depth }) => {
  const [expanded, setExpanded] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const loadReplies = async () => {
    if (replies.length > 0) return; // Prevent duplicate fetch
    setLoading(true);
    const data = await client.fetch<Comment[]>(
      `*[_type == "comment" && parent._ref == $id] | order(createdAt asc) {
        _id, name, message, createdAt, parent-> { name }, "replyCount": count(*[_type == "comment" && parent._ref == ^._id])
      }`,
      { id: comment._id }
    );
    setReplies(data);
    setLoading(false);
  };

  const toggleReplies = () => {
    setExpanded((prev) => {
      if (!prev) loadReplies();
      return !prev;
    });
  };

  const hasReplies = (comment.replyCount ?? 0) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel premium-border rounded-[2.5rem] p-10 shadow-xl"
      style={{ marginLeft: depth > 0 ? `${depth * 40}px` : 0 }}
    >
      {comment.parent?.name && (
        <p className="mb-2 text-sm text-primary">
          {t("blog.replyTo")} @{comment.parent.name}
        </p>
      )}

      <div className="mb-4 flex items-center gap-4">
        <h4 className="text-lg font-bold">{comment.name}</h4>
        <span className="text-sm text-muted-foreground">
          {format(new Date(comment.createdAt), "MMM d, yyyy")}
        </span>
      </div>

      <p className="mb-6 text-foreground/80">{comment.message}</p>

      <button
        onClick={() => onReply(comment._id)}
        className="flex items-center gap-1 text-sm text-primary hover:underline"
      >
        <Reply className="h-4 w-4" />
        {t("blog.reply")}
      </button>

      {hasReplies && (
        <button
          onClick={toggleReplies}
          className="ml-6 mt-3 flex items-center gap-1 text-sm text-muted-foreground hover:underline"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          {expanded ? t("blog.hideReplies") : t("blog.showReplies")} (
          {comment.replyCount ?? 0})
        </button>
      )}

      {expanded && (
        <div className="mt-6 space-y-6">
          {loading ? (
            <CommentSkeleton count={2} indented />
          ) : (
            replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                onReply={onReply}
                t={t}
                depth={depth + 1}
              />
            ))
          )}
        </div>
      )}
    </motion.div>
  );
};

const PostSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="h-96 animate-pulse bg-muted" />
    <div className="container mx-auto px-6 py-20">
      <div className="mb-8 h-12 w-3/4 animate-pulse rounded bg-muted" />
      <div className="space-y-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-4 animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
  </div>
);

const CommentSkeleton = ({
  count = 1,
  indented = false,
}: {
  count?: number;
  indented?: boolean;
}) => (
  <div className={indented ? "pl-10" : ""}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="mb-8 animate-pulse rounded-2xl bg-card p-8">
        <div className="mb-4 h-5 w-40 rounded bg-muted" />
        <div className="mb-3 h-4 w-32 rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-4 rounded bg-muted" />
          <div className="h-4 w-11/12 rounded bg-muted" />
          <div className="h-4 w-8/12 rounded bg-muted" />
        </div>
      </div>
    ))}
  </div>
);