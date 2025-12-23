// components/ServicesShowcaseSection.jsx
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const screenshots = [
  "https://cdn.dribbble.com/userupload/36920980/file/original-a0ec4843bec5f7d2c19f93c566edee63.png?resize=752x&vertical=center",
  "https://cdn.dribbble.com/userupload/17730953/file/original-05a2f18aae02857f16dc660924a28639.png?format=webp&resize=400x300&vertical=center",
  "https://www.uxdesigninstitute.com/blog/wp-content/uploads/2024/11/101_UX_vs_UI_illustration_blog-1.png",
  "https://cdn.dribbble.com/userupload/42922403/file/original-53144ab68d4ef8bad25d3aa53a759b76.jpg",
  "https://file.mockplus.com/image/2019/11/e2c96dfa-05b1-4d84-b56c-5fc6d756a33e.jpg",
];

const items = [...screenshots, ...screenshots, ...screenshots];

export default function ServicesShowcaseSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <section
      className="py-24 px-4 overflow-hidden bg-gradient-to-b from-background via-transparent to-background/90"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center font-playfair mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            {t("shopPreview.heroWord")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-foreground max-w-2xl mx-auto"
          >
            {t("shopPreview.heroSubtitle")}
          </motion.p>
        </div>

        {/* Pure Auto-Scrolling Carousel - NO SCROLL DEPENDENCY */}
        <div className="relative mb-20">
          {/* Gradient Fades */}
          <div className="absolute inset-y-0 start-0 w-32  z-10 pointer-events-none" />
          <div className="absolute inset-y-0 end-0 w-32  z-10 pointer-events-none" />

          {/* Row 1 - Fast */}
          <motion.div
            className="flex gap-8"
            animate={{
              x: ["50%", "-50%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {items.map((src, i) => (
              <div key={`row1-${i}`} className="flex-shrink-0 w-80">
                <div className="group relative rounded-2xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <img
                    src={src}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Row 2 - Slower, opposite direction */}
          <motion.div
            className="flex gap-8 mt-8"
            animate={{
              x: ["-50%", "50%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {items.map((src, i) => (
              <div key={`row2-${i}`} className="flex-shrink-0 w-80">
                <div className="group relative rounded-2xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <img
                    src={src}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <div className="flex font-playfair justify-center items-center gap-6 mt-20">
          {" "}
          {/* Adjust gap-6 as needed: gap-4 for closer, gap-8 for more space */}
          <motion.a
            href="/services"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-6 bg-primary text-primary-foreground rounded-full text-xl font-bold shadow-2xl hover:shadow-primary/25 transition-all duration-300"
          >
            {t("shopPreview.cta1", "Start Building Now")}
          </motion.a>
          <motion.a
            href="/gallery"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-6 bg-white  text-black rounded-full text-xl font-bold shadow-2xl hover:shadow-primary/25 transition-all duration-300"
          >
            {t("shopPreview.cta2", "Explore Services")}{" "}
            {/* Update text as needed */}
          </motion.a>
        </div>
      </div>
    </section>
  );
}
