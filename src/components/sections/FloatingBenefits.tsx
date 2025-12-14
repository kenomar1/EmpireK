// src/components/FloatingBenefits.tsx
import { Zap, Rocket, DollarSign, Leaf, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

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
      className="relative w-full overflow-hidden bg-background py-16 md:py-24 lg:py-32"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Mobile: Stacked layout (text first, icons below) */}
        <div className="block md:hidden space-y-12">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground text-center">
            {heading}
          </h2>

          {/* Mobile Floating Icons Grid */}
          <div className="relative h-80 overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 to-background">
            {benefits.map((item, i) => {
              const Icon = iconMap[item.icon] || Zap;
              return (
                <div
                  key={i}
                  className="absolute flex flex-col items-center gap-3 p-5 rounded-2xl 
                             bg-white/90 backdrop-blur-xl border border-primary/20 
                             shadow-2xl animate-float"
                  style={{
                    top: `${10 + (i % 2) * 35}%`,
                    left: `${10 + (i % 3) * 25}%`,
                    animationDelay: `${i * 1.2}s`,
                    animationDuration: `${15 + i * 2}s`,
                  }}
                >
                  <Icon className="h-12 w-12 text-primary" strokeWidth={1.8} />
                </div>
              );
            })}
          </div>

          {/* Mobile Text List */}
          <div className="space-y-8">
            {benefits.map((item, i) => {
              const Icon = iconMap[item.icon] || Zap;
              return (
                <div key={i} className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop: Original side-by-side layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* LEFT: Floating Icons */}
          <div className="relative h-96 lg:h-[600px] overflow-hidden rounded-3xl bg-transparent">
            {benefits.map((item, i) => {
              const Icon = iconMap[item.icon] || Zap;
              return (
                <div
                  key={i}
                  className="absolute flex flex-col items-center gap-4 p-6 rounded-3xl 
                             bg-white/95 backdrop-blur-xl border border-primary/20 
                             shadow-2xl animate-float"
                  style={{
                    top: `${8 + i * 16}%`,
                    left: `${10 + (i % 3) * 28}%`,
                    animationDelay: `${i * 1.5}s`,
                    animationDuration: `${16 + i * 3}s`,
                  }}
                >
                  <Icon className="h-16 w-16 text-primary" strokeWidth={1.5} />
                </div>
              );
            })}
          </div>

          {/* RIGHT: Text */}
          <div className="space-y-10 lg:space-y-12">
            <h2 className="text-5xl lg:text-6xl font-black tracking-tight text-foreground">
              {heading}
            </h2>

            {benefits.map((item, i) => {
              const Icon = iconMap[item.icon] || Zap;
              return (
                <div key={i} className="flex items-start gap-6">
                  <div className="p-4 rounded-2xl bg-primary/10 flex-shrink-0">
                    <Icon className="h-9 w-9 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
