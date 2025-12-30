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
      className="w-full py-16 md:py-24 bg-transparent"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="px-4 md:px-8">
        <div className="glass-panel p-8 md:p-16 rounded-[2.5rem] border-white/10 w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-playfair font-black tracking-tight text-foreground">
              {textWithImage("heading")}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Side */}
            <div className={isRTL ? "md:order-2" : "md:order-1"}>
              <div className="space-y-8">
                <h3 className="text-2xl md:text-4xl font-bold text-primary leading-tight">
                  {textWithImage("texthead")}
                </h3>
                <p className="text-lg md:text-xl text-foreground/80 leading-relaxed whitespace-pre-line">
                  {textWithImage("text")}
                </p>
                <a href="/about" className="mt-8 inline-block">
                  <Button
                    size="lg"
                    variant="default"
                    className="px-10 py-7 text-lg font-bold shadow-2xl hover:shadow-primary/30 transition-all rounded-2xl"
                  >
                    {textWithImage("buttonText")}
                  </Button>
                </a>
              </div>
            </div>

            {/* Image Side */}
            <div
              className={`hidden sm:block ${isRTL ? "md:order-1" : "md:order-2"}`}
            >
              <div className="relative group">
                <div className="absolute -inset-4  opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <img
                  src={LOCAL_IMAGE_SRC}
                  alt={textWithImage("heading")}
                  className="relative w-full h-auto object-cover aspect-square rounded-[2rem] "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
