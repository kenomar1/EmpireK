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
      className="py-24 px-6 overflow-hidden relative"
      dir={isRTL ? "rtl" : "ltr"}
    >

      <div className="max-w-7xl mx-auto relative z-10">
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
          {/* Row 1 - Fast */}
          <motion.div
            className="flex gap-4 md:gap-8"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {items.map((src, i) => (
              <div key={`row1-${i}`} className="flex-shrink-0 w-64 md:w-80">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="group relative rounded-[1.5rem] md:rounded-[2rem] p-2 md:p-3 glass-panel premium-border shadow-2xl transition-all duration-500"
                >
                  <div className="relative rounded-[1rem] md:rounded-[1.5rem] overflow-hidden">
                    <img
                      src={src}
                      alt={`Preview ${i + 1}`}
                      className="w-full h-48 md:h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>

          {/* Row 2 - Slower, opposite direction */}
          <motion.div
            className="flex gap-4 md:gap-8 mt-8 md:mt-12"
            animate={{
              x: ["-50%", "0%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 45,
                ease: "linear",
              },
            }}
          >
            {items.map((src, i) => (
              <div key={`row2-${i}`} className="flex-shrink-0 w-64 md:w-80">
                <motion.div 
                   whileHover={{ scale: 1.05 }}
                   className="group relative rounded-[1.5rem] md:rounded-[2rem] p-2 md:p-3 glass-panel premium-border shadow-2xl transition-all duration-500"
                >
                  <div className="relative rounded-[1rem] md:rounded-[1.5rem] overflow-hidden">
                    <img
                      src={src}
                      alt={`Preview ${i + 1}`}
                      className="w-full h-48 md:h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row font-playfair justify-center items-center gap-4 md:gap-6 mt-12 md:mt-20">
          <motion.a
            href="/services"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto text-center inline-flex justify-center items-center gap-3 px-8 md:px-10 py-4 md:py-6 bg-primary text-primary-foreground rounded-full text-lg md:text-xl font-bold shadow-2xl hover:shadow-primary/25 transition-all duration-300"
          >
            {t("shopPreview.cta1", "Start Building Now")}
          </motion.a>
          <motion.a
            href="/gallery"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto text-center inline-flex justify-center items-center gap-3 px-8 md:px-10 py-4 md:py-6 bg-white text-black rounded-full text-lg md:text-xl font-bold shadow-2xl hover:shadow-primary/25 transition-all duration-300"
          >
            {t("shopPreview.cta2", "Explore Services")}
          </motion.a>
        </div>
      </div>
    </section>
  );
}
