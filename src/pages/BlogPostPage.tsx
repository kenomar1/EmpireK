"use client";

import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { PortableText } from "@portabletext/react";
import { format } from "date-fns";
import { MessageSquare, Reply, ChevronDown, ChevronUp } from "lucide-react";
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
          _id, title, excerpt, mainImage, publishedAt, body,
          author-> { name, role, avatar }, category-> { title }
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
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-background py-32">
        {post.mainImage && (
          <img
            src={urlFor(post.mainImage).width(1920).height(1080).url()}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover opacity-20"
            loading="lazy"
          />
        )}
        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="mb-8 text-5xl font-bold md:text-7xl">
              {post.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Article Body */}
      <article className="container mx-auto max-w-4xl px-6 py-20">
        {post.excerpt && (
          <p className="mb-12 text-xl text-foreground">{post.excerpt}</p>
        )}
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
          <PortableText value={post.body} components={ptComponents} />
        </div>
      </article>

      {/* Comments Section */}
      <section className="container mx-auto border-t border-border px-6 py-16">
        <h2 className="mb-12 flex items-center gap-3 text-4xl font-bold">
          <MessageSquare className="h-8 w-8 text-primary" />
          {t("blog.comments")}
        </h2>

        {/* Comment Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-16 rounded-2xl bg-card p-8 shadow-lg"
        >
          <h3 className="mb-6 text-2xl font-semibold">
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
              className="rounded-lg border border-border bg-background p-4 focus:ring-2 focus:ring-primary disabled:opacity-50"
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
              className="rounded-lg border border-border bg-background p-4 focus:ring-2 focus:ring-primary disabled:opacity-50"
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
            className="mt-6 w-full rounded-lg border border-border bg-background p-4 focus:ring-2 focus:ring-primary disabled:opacity-50"
          />

          <div className="mt-6 flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-8 py-4 font-bold text-primary-foreground disabled:opacity-50"
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
      className="rounded-2xl border border-border bg-card p-8 shadow-md"
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