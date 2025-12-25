"use client";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PortableText } from "@portabletext/react";
import { format } from "date-fns";
import { User, MessageSquare, Reply } from "lucide-react";
import { motion } from "framer-motion";
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

type Comment = {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
  parent?: { _ref: string };
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (!slug) return;

    const query = `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      excerpt,
      mainImage,
      publishedAt,
      body,
      tags,
      author->{
        name,
        role,
        avatar
      },
      "readTime": round(length(pt::text(body)) / 600 + 1)
    }`;

    client
      .fetch(query, { slug })
      .then((data) => setPost(data))
      .catch((err) => console.error("Error fetching post:", err));
  }, [slug]);

  const fetchComments = async () => {
    if (!post?._id) return;

    setLoadingComments(true);
    // Show all comments immediately (no approval filter)
    const commentsQuery = `*[_type == "comment" && post._ref == $postId] | order(createdAt desc) {
      _id,
      name,
      message,
      createdAt,
      parent
    }`;

    try {
      const data: Comment[] = await client.fetch(commentsQuery, {
        postId: post._id,
      });
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (post?._id) fetchComments();
  }, [post?._id]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!name.trim()) errors.name = t("blog.required", "Required");
    if (!email.trim()) {
      errors.email = t("blog.required", "Required");
    } else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim())) {
      errors.email = t("blog.invalidEmail", "Invalid email");
    }
    if (!message.trim()) {
      errors.message = t("blog.required", "Required");
    } else if (message.trim().length < 10) {
      errors.message = t("blog.minLength", "Minimum 10 characters");
    } else if (message.trim().length > 1000) {
      errors.message = t("blog.maxLength", "Maximum 1000 characters");
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post?._id || !validateForm()) return;

    setSubmitting(true);
    setSubmitStatus("idle");

    const newComment = {
      _type: "comment",
      post: { _type: "reference", _ref: post._id },
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      parent: replyTo
        ? { _type: "reference", _ref: replyTo, _weak: true }
        : undefined,
      // No 'approved' field — comments appear immediately
    };

    try {
      const created = await client.create(newComment);

      // Optimistic update: show comment instantly
      setComments((prev) => [created, ...prev]);

      setName("");
      setEmail("");
      setMessage("");
      setReplyTo(null);
      setSubmitStatus("success");
    } catch (err: any) {
      console.error("Comment submission failed:", err);
      setSubmitStatus("error");
      fetchComments(); // Sync on error
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyTo(commentId);
    document.querySelector("form")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl text-red-500">
        {t("blog.postNotFound", "Post not found")}
      </div>
    );
  }

  return (
    <>
      <title>{post.title} | EmpireK</title>
      <meta name="description" content={post.excerpt || "Blog post"} />

      <div
        className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Hero Section */}
        <section className="pt-10 pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl mt-5 md:text-7xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 mt-10 text-muted-foreground">
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
          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80">
            <PortableText value={post.body} components={ptComponents} />
          </div>
        </article>

        {/* Comments Section - Flat Layout with Instant Visibility */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-background/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/30 p-6 sm:p-10 lg:p-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-10 flex items-center gap-3 flex-wrap">
              <MessageSquare className="w-9 h-9 sm:w-10 sm:h-10 text-primary" />
              <span>
                {t("blog.comments", "Comments")} ({comments.length})
              </span>
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-12">
              {replyTo && (
                <div className="mb-6 p-4 bg-muted/50 rounded-xl flex items-center justify-between flex-wrap gap-4">
                  <p className="text-sm text-muted-foreground">
                    {t("blog.replyingTo", "Replying to")}{" "}
                    <span className="font-medium text-foreground">
                      @
                      {comments.find((c) => c._id === replyTo)?.name ||
                        "a comment"}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="text-primary text-sm underline"
                  >
                    {t("blog.cancel", "Cancel")}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("blog.name", "Name")}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 focus:border-primary focus:outline-none transition text-base"
                    placeholder={t("blog.yourName", "Your name")}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-red-600 text-sm">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("blog.email", "Email")}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 focus:border-primary focus:outline-none transition text-base"
                    placeholder={t("blog.yourEmail", "your@email.com")}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-red-600 text-sm">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  {t("blog.message", "Message")}
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 focus:border-primary focus:outline-none transition resize-none text-base"
                  placeholder={t("blog.yourComment", "Share your thoughts...")}
                />
                {formErrors.message && (
                  <p className="mt-1 text-red-600 text-sm">
                    {formErrors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto sm:mx-0"
              >
                {submitting
                  ? t("blog.submitting", "Submitting...")
                  : t("blog.postComment", "Post Comment")}
              </button>

              {submitStatus === "success" && (
                <p className="mt-6 text-green-600 font-medium text-center sm:text-left">
                  {t("blog.commentSuccess", "Your comment has been posted!")}
                </p>
              )}
              {submitStatus === "error" && (
                <p className="mt-6 text-red-600 font-medium text-center sm:text-left">
                  {t(
                    "blog.commentError",
                    "Something went wrong. Please try again."
                  )}
                </p>
              )}
            </form>

            {/* Flat Comments List */}
            {loadingComments ? (
              <p className="text-muted-foreground text-center py-8">
                {t("blog.loadingComments", "Loading comments...")}
              </p>
            ) : comments.length === 0 ? (
              <p className="text-muted-foreground text-lg text-center py-12">
                {t(
                  "blog.noComments",
                  "No comments yet. Be the first to share your thoughts!"
                )}
              </p>
            ) : (
              <div className="space-y-8">
                {comments.map((comment) => (
                  <FlatCommentItem
                    key={comment._id}
                    comment={comment}
                    allComments={comments}
                    handleReply={handleReply}
                    t={t}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}

// Flat Comment Item - Shows "Replying to @name"
const FlatCommentItem: React.FC<{
  comment: Comment;
  allComments: Comment[];
  handleReply: (id: string) => void;
  t: any;
}> = ({ comment, allComments, handleReply, t }) => {
  const parentComment = comment.parent?._ref
    ? allComments.find((c) => c._id === comment.parent?._ref)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex gap-4 pb-10 border-b border-border/30 last:border-0"
    >
      <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
        <User className="w-7 h-7 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        {parentComment && (
          <p className="text-xs text-muted-foreground mb-2">
            {t("blog.replyingTo", "Replying to")}{" "}
            <span className="font-medium text-foreground">
              @{parentComment.name}
            </span>
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
          <h4 className="font-bold text-foreground text-lg">{comment.name}</h4>
          <span className="text-xs text-muted-foreground">
            {format(new Date(comment.createdAt), "MMM d, yyyy")}
          </span>
        </div>

        <p className="text-foreground/80 leading-relaxed break-words">
          {comment.message}
        </p>

        <button
          onClick={() => handleReply(comment._id)}
          className="mt-3 text-primary flex items-center gap-1.5 text-sm hover:underline"
        >
          <Reply className="w-4 h-4" />
          {t("blog.reply", "Reply")}
        </button>
      </div>
    </motion.div>
  );
};
