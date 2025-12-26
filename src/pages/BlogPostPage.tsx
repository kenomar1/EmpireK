"use client";

import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { PortableText } from "@portabletext/react";
import { format } from "date-fns";
import { User, MessageSquare, Reply, Loader2, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { client, urlFor } from "../lib/sanityClient";
import Footer from "../components/layout/Footer";

const ptComponents = {
  types: {
    image: ({ value }: any) => (
      <div
        className="my-16 rounded-3xl overflow-hidden shadow-2xl"
        role="img"
        aria-label={value.alt || "Blog post image"}
      >
        <img
          src={urlFor(value).width(1600).height(900).fit("crop").url()}
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
  category?: { title?: string };
  publishedAt?: string;
  excerpt?: string;
};

type Comment = {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  approved: boolean;
  parent?: {
    _ref: string;
    name?: string; // Now properly typed and fetched
  } | null;
  replies?: Comment[];
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const currentLang = i18n.language || "en";

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const commentsPerPage = 10;

  const fetchPostAndComments = useCallback(async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch post in current language with same slug
      const postQuery = `*[_type == "post" && slug.current == $slug && language == $lang][0]{
        _id,
        title,
        excerpt,
        mainImage,
        publishedAt,
        body,
        author-> { name, role, avatar },
        category-> { title }
      }`;

      const fetchedPost: Post | null = await client.fetch(postQuery, {
        slug,
        lang: currentLang,
      });

      if (!fetchedPost) {
        setError(t("blog.postNotFound"));
        setLoading(false);
        return;
      }

      setPost(fetchedPost);

      // Fetch approved comments + parent name for replies
      const commentsQuery = `*[_type == "comment" && post._ref == $postId && approved == true] | order(createdAt desc){
        _id,
        name,
        message,
        createdAt,
        parent-> { _ref, name }
      }`;

      const rawComments: Comment[] = await client.fetch(commentsQuery, {
        postId: fetchedPost._id,
      });

      // Build nested structure
      const nested: Comment[] = [];
      const map = new Map<string, Comment>();

      rawComments.forEach((comment) => {
        const mapped = { ...comment, replies: [] as Comment[] };
        map.set(comment._id, mapped);
      });

      rawComments.forEach((comment) => {
        if (comment.parent?._ref) {
          const parentComment = map.get(comment.parent._ref);
          if (parentComment) {
            parentComment.replies!.push(map.get(comment._id)!);
          }
        } else {
          nested.push(map.get(comment._id)!);
        }
      });

      setComments(nested);
    } catch (err) {
      console.error(err);
      setError(t("blog.errorFetching"));
    } finally {
      setLoading(false);
    }
  }, [slug, currentLang, t]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  const handleCommentSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (submitting || !post) return;

      setSubmitting(true);

      try {
        await client.create({
          _type: "comment",
          post: { _type: "reference", _ref: post._id },
          name: newComment.name.trim(),
          email: newComment.email.trim(),
          message: newComment.message.trim(),
          approved: false,
          ...(replyTo && { parent: { _type: "reference", _ref: replyTo } }),
        });

        toast.success(t("blog.commentSubmitted"));
        setNewComment({ name: "", email: "", message: "" });
        setReplyTo(null);
        fetchPostAndComments();
      } catch (err) {
        toast.error(t("blog.commentError"));
      } finally {
        setSubmitting(false);
      }
    },
    [newComment, post, replyTo, submitting, t, fetchPostAndComments]
  );

  const handleReply = (commentId: string) => {
    setReplyTo(commentId);
    setTimeout(() => document.querySelector("textarea")?.focus(), 100);
  };

  const paginatedComments = comments.slice(0, page * commentsPerPage);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen items-center justify-center text-2xl text-red-500">
        {error || t("blog.postNotFound")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero */}
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
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              {post.author?.name && (
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5" />
                  <span>
                    {post.author.name}{" "}
                    {post.author.role && `• ${post.author.role}`}
                  </span>
                </div>
              )}
              {post.publishedAt && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5" />
                  <time>
                    {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                  </time>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Body */}
      {/* Article Body */}
      <article className="container mx-auto max-w-4xl px-6 py-20">
        {post.excerpt && (
          <p className="mb-12 text-xl text-foreground">{post.excerpt}</p>
        )}
        <div
          className="
            prose prose-lg 
            dark:prose-invert 
            max-w-none 
            text-foreground
            prose-ul:list-disc 
            prose-ol:list-decimal
            prose-li:marker:text-primary 
            prose-li:marker:font-bold
            dark:prose-li:marker:text-primary
          "
        >
          <PortableText value={post.body} components={ptComponents} />
        </div>
      </article>

      {/* Comments */}
      <section className="container mx-auto border-t border-border px-6 py-16">
        <h2 className="mb-12 flex items-center gap-3 text-4xl font-bold">
          <MessageSquare className="h-8 w-8 text-primary" />
          {t("blog.comments")} ({comments.length})
        </h2>

        {/* Comment Form */}
        <form
          onSubmit={handleCommentSubmit}
          className="mb-16 rounded-2xl bg-card p-8 shadow-lg"
        >
          <h3 className="mb-6 text-2xl font-semibold">
            {replyTo ? t("blog.replyToComment") : t("blog.leaveComment")}
          </h3>

          {replyTo && (
            <div className="mb-4 text-sm text-primary">
              {t("blog.replyTo")} @
              {comments.find((c) => c._id === replyTo)?.name || "someone"}
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
              className="rounded-lg border border-border bg-background p-4 focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              placeholder={t("blog.emailPlaceholder")}
              value={newComment.email}
              onChange={(e) =>
                setNewComment({ ...newComment, email: e.target.value })
              }
              required
              className="rounded-lg border border-border bg-background p-4 focus:ring-2 focus:ring-primary"
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
            className="mt-6 w-full rounded-lg border border-border bg-background p-4 focus:ring-2 focus:ring-primary"
          />

          <div className="mt-6 flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-bold text-primary-foreground disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t("blog.submitting")}
                </>
              ) : (
                t("blog.submit")
              )}
            </button>
            {replyTo && (
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-muted-foreground underline"
              >
                {t("blog.cancelReply")}
              </button>
            )}
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-12">
          {paginatedComments.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {t("blog.noComments")}
            </p>
          ) : (
            paginatedComments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                onReply={handleReply}
                t={t}
              />
            ))
          )}
        </div>

        {page * commentsPerPage < comments.length && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="mx-auto mt-8 block rounded-lg bg-accent px-6 py-3 text-accent-foreground"
          >
            {t("blog.loadMore")}
          </button>
        )}
      </section>

      <Footer />
    </div>
  );
}

// Fixed t type using proper i18next return type
type CommentItemProps = {
  comment: Comment;
  onReply: (id: string) => void;
  t: ReturnType<typeof useTranslation>["t"];
};

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, t }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl border border-border bg-card p-8 shadow-md"
  >
    {/* Safe display of reply target */}
    {comment.parent?._ref && comment.parent?.name && (
      <p className="mb-2 text-sm text-primary">
        {t("blog.replyTo")} @{comment.parent.name}
      </p>
    )}

    <div className="mb-4 flex flex-wrap items-center gap-4">
      <h4 className="text-lg font-bold">{comment.name}</h4>
      <span className="text-sm text-muted-foreground">
        {format(new Date(comment.createdAt), "MMM d, yyyy")}
      </span>
    </div>

    <p className="mb-4 break-words text-foreground/80">{comment.message}</p>

    <button
      onClick={() => onReply(comment._id)}
      className="flex items-center gap-1.5 text-sm text-primary hover:underline"
    >
      <Reply className="h-4 w-4" />
      {t("blog.reply")}
    </button>

    {/* Nested replies */}
    {comment.replies && comment.replies.length > 0 && (
      <div className="mt-8 space-y-8 border-l-4 border-border pl-8">
        {comment.replies.map((reply) => (
          <CommentItem
            key={reply._id}
            comment={reply}
            onReply={onReply}
            t={t}
          />
        ))}
      </div>
    )}
  </motion.div>
);