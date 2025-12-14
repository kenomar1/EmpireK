// src/Components/ui/textAndPiture.tsx
"use client";

import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

const LOCAL_IMAGE_SRC = "/about.svg";

export function TextWithImageSection() {
  const { i18n, t } = useTranslation();
  const textWithImage = (key: "heading" | "texthead" | "text" | "buttonText") =>
    t(`textWithImage.${key}`);

  const isRTL = i18n.language === "ar";

  return (
    <section
      className="w-full py-16 md:py-24 bg-background"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          {textWithImage("heading")}
        </h2>
      </div>

      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Text Side */}
        <div className={isRTL ? "md:order-2" : "md:order-1"}>
          <div className="space-y-6">
            <h3 className="text-lg md:text-3xl font-bold text-primary leading-relaxed">
              {textWithImage("texthead")}
            </h3>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed whitespace-pre-line">
              {textWithImage("text")}
            </p>
            <Button
              size="lg"
              variant="default"
              className="mt-6 shadow-lg hover:shadow-xl transition-all"
            >
              {textWithImage("buttonText")}
            </Button>
          </div>
        </div>

        {/* Image Side */}
        <div
          className={`hidden sm:block ${isRTL ? "md:order-1" : "md:order-2"}`}
        >
          <div className="relative overflow-hidden">
            <img
              src={LOCAL_IMAGE_SRC}
              alt={textWithImage("heading")}
              className="w-full h-auto object-cover aspect-video md:aspect-square rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
