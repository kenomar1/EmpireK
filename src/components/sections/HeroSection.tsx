// src/components/HeroPromo.tsx
"use client";

import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Earth } from "lucide-react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { useTheme } from "../../context/ThemeContext"; // ← Adjust this path if your file is elsewhere

export function HeroPromo() {
  const { i18n, t } = useTranslation();
  const { theme } = useTheme(); // Gets "light" or "dark" from your custom context

  const heroCopy = (key: "heading" | "subheading" | "herocta1" | "herocta2") =>
    t(`hero.${key}`);

  const isRTL = i18n.language === "ar";

  // Dark mode background (your original deep purple/gray style)
  const darkUrl =
    "https://shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.3&cAzimuthAngle=250&cDistance=1.5&cPolarAngle=140&cameraZoom=12.5&color1=%230E001A&color2=%23A12EFF&color3=%235A00A3&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.5&rotationX=0&rotationY=0&rotationZ=140&shader=defaults&type=sphere&uAmplitude=7&uDensity=0.8&uFrequency=5.5&uSpeed=0.3&uStrength=0.4&uTime=0&wireframe=false";

  // Light mode background – soft, bright, elegant (customize further on shadergradient.co)
  const lightUrl =
    "https://shadergradient.co/customize?animate=on&axesHelper=off&brightness=1.5&cAzimuthAngle=250&cDistance=1.5&cPolarAngle=140&cameraZoom=12.5&color1=%236a11d6&color2=%23ffffff&color3=%23ffffff&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.5&rotationX=0&rotationY=0&rotationZ=140&shader=defaults&type=sphere&uAmplitude=7&uDensity=0.8&uFrequency=5.5&uSpeed=0.3&uStrength=0.4&uTime=0&wireframe=false";

  const backgroundUrl = theme === "dark" ? darkUrl : lightUrl;

  return (
    <>
      {/* Full-Screen Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <ShaderGradientCanvas
          className="absolute inset-0"
          style={{ pointerEvents: "none" }}
        >
          <ShaderGradient
            control="query"
            urlString={backgroundUrl}
            key={theme} // Ensures clean remount when switching themes
          />
        </ShaderGradientCanvas>
      </div>

      {/* Hero Content */}
      <section
        className="relative w-full min-h-screen flex items-center justify-center px-6 pt-20 md:pt-24"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="w-full max-w-5xl mx-auto text-center">
          {/* Floating Logo */}
          <div className="relative -mb-12 z-20">
            <div
              className={`
                inline-flex items-center justify-center rounded-full p-5 shadow-2xl backdrop-blur-sm border-2
                ${
                  theme === "dark"
                    ? "bg-white/70 border-white/30"
                    : "bg-white/90 border-black/20"
                }
              `}
            >
              <img
                src="/Logo.avif"
                alt="Logo"
                className="h-16 w-16 md:h-20 md:w-20"
              />
            </div>
          </div>

          {/* Glassmorphism Card */}
          <div
            className={`
              relative rounded-3xl shadow-2xl overflow-hidden border
              ${
                theme === "dark"
                  ? "bg-black/10 border-white/20 backdrop-blur-md"
                  : "bg-white/50 border-black/10 backdrop-blur-lg"
              }
            `}
          >
            <div className="relative z-10 p-8 md:p-12 lg:p-16 pt-16 md:pt-20">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6
                  ${theme === "dark" ? "bg-primary/10 text-primary" : "bg-primary/20 text-primary-foreground"}
                `}
              >
                <Earth className="w-4 h-4" />
                {t("shopPreview.eyebrow")}
              </motion.div>

              {/* Heading */}
              <h1
                className={`
    text-4xl xs:text-5xl sm:text-6xl md:text-5xl lg:text-7xl 
    font-bold tracking-tight drop-shadow-2xl leading-tight
    ${i18n.language === "ar" ? "font-cairo" : "font-playfair"}
    ${theme === "dark" ? "text-white" : "text-gray-900"}
  `}
              >
                {heroCopy("heading")}
              </h1>

              {/* Subheading */}
              <p
                className={`
                  mt-6 text-lg xs:text-xl sm:text-2xl md:text-3xl font-medium drop-shadow-lg leading-relaxed max-w-3xl mx-auto
                  ${theme === "dark" ? "text-white/90" : "text-gray-800"}
                `}
                dangerouslySetInnerHTML={{ __html: heroCopy("subheading") }}
              />

              {/* CTA Buttons */}
              <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                <Button
                  size="lg"
                  variant="default"
                  className="w-full sm:w-auto px-10 py-6 text-base md:text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl"
                  asChild
                >
                  <a href="/contact">{heroCopy("herocta2")}</a>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className={`
                    w-full sm:w-auto px-10 py-6  md:text-lg font-bold border-2 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl
                    ${
                      theme === "dark"
                        ? "border-white/50 hover:bg-foreground text-white"
                        : "border-foreground/50 hover:bg-background/90 hover:text-foreground text-gray-900"
                    }
                  `}
                  asChild
                >
                  <a href="/services">{heroCopy("herocta1")}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}