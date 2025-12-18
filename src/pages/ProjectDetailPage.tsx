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

type ImageAsset = {
  asset?: { url: string };
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
  body?: string;
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
            transition={{ duration: 1.2 }}
            src={urlFor(mainImg.url).width(1920).height(1080).fit("crop").url()}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-black mb-6">
                {project.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-xl">
                {project.client && <span>{project.client}</span>}
                {project.year && (
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {project.year}
                  </span>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full hover:bg-white/30 transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                    {t("gallery.viewLive", "View Live")}
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Description */}
      {project.body && (
        <section className="px-6 py-20 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none text-foreground/80"
          >
            <p className="text-xl leading-relaxed">{project.body}</p>
          </motion.div>
        </section>
      )}

      {/* Full Gallery */}
      {galleryImgs.length > 0 && (
        <section className="px-6 pb-32">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-center mb-16"
            >
              {t("gallery.projectGallery", "Project Gallery")}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryImgs.map((img, index) => (
                <motion.div
                  key={img.caption || `img-${index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => openLightbox(mainImg ? index + 1 : index)}
                  className="relative overflow-hidden rounded-3xl shadow-xl cursor-pointer group"
                >
                  <img
                    src={urlFor(img.url)
                      .width(800)
                      .height(600)
                      .fit("crop")
                      .url()}
                    alt={img.caption || project.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-center font-medium">
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && allImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-8"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-8 right-8 text-white hover:text-primary transition-colors"
            >
              <X className="w-10 h-10" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-8 text-white hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-8 text-white hover:text-primary transition-colors"
            >
              <ChevronRight className="w-12 h-12" />
            </button>

            <motion.img
              key={currentImageIndex}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={urlFor(allImages[currentImageIndex].url)
                .width(1920)
                .height(1080)
                .url()}
              alt={allImages[currentImageIndex].caption || project.title}
              className="max-w-full max-h-full object-contain"
            />

            {allImages[currentImageIndex].caption && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white text-lg bg-black/50 px-6 py-3 rounded-full">
                {allImages[currentImageIndex].caption}
              </div>
            )}

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-lg">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
