// src/pages/ProjectDetailPage.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { client, urlFor } from "../lib/sanityClient";
import { PortableText } from "@portabletext/react";

type ImageAsset = {
  asset?: { url: string };
  caption?: string;
  alt?: string;
};

type GalleryImage = {
  _key: string;
  asset?: { url: string };
  caption?: string;
};

type Project = {
  _id: string;
  title: string;
  client?: string;
  year?: number;
  body?: any[]; // Portable Text value
  link?: string;
  mainImage?: ImageAsset;
  images?: GalleryImage[];
};

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    if (!slug) return;

    const query = `*[_type == "project" && slug.current == $slug && language == $lang][0] {
      title,
      client,
      year,
      body,
      link,
      mainImage { asset-> { url } },
      images[] { _key, caption, asset-> { url } }
    }`;

    client
      .fetch<Project>(query, {
        slug,
        lang: i18n.language === "ar" ? "ar" : "en",
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug, i18n.language]);

  // Build full image array: mainImage first, then gallery images
  const mainImg = project?.mainImage?.asset?.url
    ? {
        url: project.mainImage.asset.url,
        caption: undefined as string | undefined,
      }
    : null;

  const galleryImgs = (project?.images || [])
    .filter((img): img is GalleryImage => !!img.asset?.url)
    .map((img) => ({ url: img.asset!.url, caption: img.caption }));

  const allImages = mainImg ? [mainImg, ...galleryImgs] : galleryImgs;

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  // Premium Portable Text components
  const ptComponents = {
    block: {
      h1: ({ children }: any) => (
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mt-16 mb-8 text-foreground leading-[1.1]">
          {children}
        </h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mt-14 mb-6 text-foreground leading-tight">
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-xl sm:text-2xl md:text-4xl font-semibold mt-12 mb-5 text-foreground">
          {children}
        </h3>
      ),
      normal: ({ children }: any) => (
        <p className="text-base sm:text-lg leading-relaxed mb-8 text-foreground/80">
          {children}
        </p>
      ),
    },
    marks: {
      strong: ({ children }: any) => (
        <span className="font-bold text-foreground">{children}</span>
      ),
      em: ({ children }: any) => <em className="italic">{children}</em>,
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc pl-8 space-y-4 mb-8 text-lg text-foreground/80">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal pl-8 space-y-4 mb-8 text-lg text-foreground/80">
          {children}
        </ol>
      ),
    },
    types: {
      image: ({ value }: any) => (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="my-16 rounded-3xl overflow-hidden shadow-2xl border border-border/30"
        >
          <img
            src={urlFor(value).width(1400).fit("max").url()}
            alt={value.alt || ""}
            className="w-full"
          />
          {value.caption && (
            <p className="text-center text-muted-foreground py-6 text-lg italic bg-background/50">
              {value.caption}
            </p>
          )}
        </motion.div>
      ),
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-2xl text-muted-foreground mb-6">
            {t("gallery.projectNotFound", "Project not found")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-background">
      {/* Hero Image */}
      {mainImg && (
        <section className="relative h-screen max-h-[80vh] overflow-hidden">
          <motion.img
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            src={urlFor(mainImg.url).width(1920).height(1080).fit("crop").url()}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="max-w-5xl mx-auto"
            >
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 drop-shadow-2xl font-BBHBogle leading-[1.1]">
                {project.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 md:gap-8 text-lg md:text-xl">
                {project.client && (
                  <span className="drop-shadow-lg">{project.client}</span>
                )}
                {project.year && (
                  <span className="flex items-center gap-3 drop-shadow-lg">
                    <Calendar className="w-6 h-6" />
                    {project.year}
                  </span>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-8 py-4 rounded-full hover:bg-white/30 transition-all shadow-xl"
                  >
                    <ExternalLink className="w-6 h-6" />
                    {t("gallery.viewLive", "View Live")}
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Rich Description with Glassmorphic Card */}
      {project.body && (
        <section className="px-6 py-20 mt-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto bg-background/70 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-border/30 p-8 md:p-12 lg:p-20"
          >
            <PortableText value={project.body} components={ptComponents} />
          </motion.div>
        </section>
      )}

      {/* Full Gallery */}
      {galleryImgs.length > 0 && (
        <section className="px-6 pb-32">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-black text-center mb-20"
            >
              {t("gallery.projectGallery", "Project Gallery")}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {galleryImgs.map((img, index) => (
                <motion.div
                  key={img.caption || `img-${index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => openLightbox(mainImg ? index + 1 : index)}
                  className="relative overflow-hidden rounded-3xl shadow-2xl cursor-pointer group bg-card/50 backdrop-blur-sm border border-border/30"
                >
                  <img
                    src={urlFor(img.url)
                      .width(900)
                      .height(700)
                      .fit("crop")
                      .url()}
                    alt={img.caption || project.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <p className="text-white text-center font-medium text-lg">
                        {img.caption}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Lightbox */}
      <AnimatePresence>
        {lightboxOpen && allImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-8 backdrop-blur-sm"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-8 right-8 text-white hover:text-primary transition-colors z-10"
            >
              <X className="w-12 h-12 drop-shadow-2xl" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-8 text-white hover:text-primary transition-colors z-10"
            >
              <ChevronLeft className="w-14 h-14 drop-shadow-2xl" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-8 text-white hover:text-primary transition-colors z-10"
            >
              <ChevronRight className="w-14 h-14 drop-shadow-2xl" />
            </button>

            <motion.img
              key={currentImageIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={urlFor(allImages[currentImageIndex].url)
                .width(1920)
                .height(1080)
                .url()}
              alt={allImages[currentImageIndex].caption || project.title}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            />

            {allImages[currentImageIndex].caption && (
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white text-xl bg-black/40 backdrop-blur-sm px-8 py-4 rounded shadow-2xl">
                {allImages[currentImageIndex].caption}
              </div>
            )}

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/80 text-lg bg-black/40 backdrop-blur-md px-6 py-3 rounded-full">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}