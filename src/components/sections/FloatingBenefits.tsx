import { Zap, Rocket, DollarSign, Leaf, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const iconMap = {
  zap: Zap,
  rocket: Rocket,
  dollar: DollarSign,
  leaf: Leaf,
  shield: Shield,
} as const;

type BenefitCopy = {
  icon: keyof typeof iconMap;
  title: string;
  desc: string;
};

const SAMPLE_LOGOS = [
  { name: "TechCorp", icon: Zap },
  { name: "EcoLogic", icon: Leaf },
  { name: "SecureMind", icon: Shield },
  { name: "RocketDev", icon: Rocket },
  { name: "FinFlow", icon: DollarSign },
  { name: "NovaDesign", icon: Zap },
  { name: "AstraSoft", icon: Rocket },
  { name: "GlobalSafe", icon: Shield },
];

function LogoRow({ isRTL }: { isRTL: boolean }) {
  return (
    <div 
      className="relative mt-8 mb-16 overflow-hidden py-10"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
      }}
    >
      <motion.div
        className="flex gap-12 md:gap-24 items-center whitespace-nowrap"
        animate={{
          x: isRTL ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Double the logos for infinite effect */}
        {[...SAMPLE_LOGOS, ...SAMPLE_LOGOS].map((logo, i) => {
          const isPrimary = i % 2 === 0;
          return (
            <div
              key={i}
              className={`flex items-center gap-4 transition-colors duration-300 group cursor-default ${
                isPrimary ? "text-primary" : "text-foreground/40 hover:text-primary"
              }`}
            >
              <logo.icon className={`w-8 h-8 md:w-10 md:h-10 ${isPrimary ? "opacity-100" : "opacity-50 group-hover:opacity-100"}`} />
              <span className="text-xl md:text-3xl font-Bebas tracking-wider uppercase">
                {logo.name}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

export function FloatingBenefits() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const benefitsData = t("floatingBenefits.items", { returnObjects: true });
  const benefits = Array.isArray(benefitsData)
    ? (benefitsData as BenefitCopy[])
    : [];
  const heading = t("floatingBenefits.heading");

  return (
    <section
      className="relative w-full overflow-hidden bg-transparent py-16 md:py-24 lg:py-32 "
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 md:mb-24 text-center">
          <h2 className="text-5xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
            {heading}
          </h2>
        </div>

        {/* Animated Logo Row */}
        <LogoRow isRTL={isRTL} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          {/* LEFT: Floating Icons */}
          <div className="relative min-h-[400px] md:min-h-full overflow-hidden rounded-[3rem]">
            {benefits.map((item, i) => {
              const Icon = iconMap[item.icon] || Zap;
              return (
                <div
                  key={i}
                  className={`absolute flex flex-col items-center gap-3 p-5 rounded-2xl bg-transparent animate-float animate-float-delay-${(i % 5) + 1}`}
                  style={{
                    top: `${5 + (i * 18) % 80}%`,
                    left: `${5 + (i * 24) % 85}%`,
                  }}
                >
                  <Icon className="h-10 md:h-16 md:w-16 w-10 text-primary" strokeWidth={1.5} />
                </div>
              );
            })}
          </div>

          {/* RIGHT: Text List */}
          <div className="space-y-6 lg:space-y-8">
            {benefits.map((item, i) => {
              const Icon = iconMap[item.icon] || Zap;
              return (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.02, x: isRTL ? -10 : 10 }}
                  className="flex items-start gap-6 p-6 md:p-8 rounded-3xl glass-panel premium-border hover:bg-white/5 transition-colors cursor-default"
                >
                  <div className="p-4 rounded-2xl bg-primary/10 flex-shrink-0">
                    <Icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

