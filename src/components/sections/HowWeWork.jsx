import {
  ArrowRight,
  Target,
  Search,
  Rocket,
  BarChart,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const iconMap = {
  target: Target,
  search: Search,
  rocket: Rocket,
  chart: BarChart,
  sparkles: Sparkles,
};

export default function HowWeWork() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const stepsData = t("howWeWork.steps", { returnObjects: true });
  const steps = Array.isArray(stepsData) ? stepsData : [];
  const heading = t("howWeWork.heading");
  const subheading = t("howWeWork.subheading");

  return (
    <section className="py-24 px-6 bg-transparent" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-playfair font-black text-foreground mb-6">
            {heading}
          </h2>
          <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto">
            {subheading}
          </p>
        </div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden lg:block relative">
          <div className="relative grid grid-cols-5 gap-8">
            {steps.map((step, index) => {
              const Icon = iconMap[step.icon] || Target;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center group p-8 rounded-[3rem] glass-panel border-white/10 premium-border shadow-xl hover:shadow-2xl hover:bg-white/5 transition-all duration-500"
                >
                  {/* Number Circle */}
                  <div className="relative z-10 mb-8">
                    <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mb-6 p-5 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-foreground mb-4 font-Cairo">
                    {step.title}
                  </h3>
                  <p className="text-base text-foreground/70 leading-relaxed font-Cairo">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => {
            const Icon = iconMap[step.icon] || Target;
            return (
              <div key={index} className="relative flex gap-6 p-8 rounded-[2.5rem] glass-panel border-white/10 premium-border shadow-xl">
                {/* Circle + Number */}
                <div className="relative z-10 shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-2xl font-bold text-primary font-Cairo">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="mb-4 p-4 rounded-xl bg-primary/10 inline-block font-Cairo">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-3 font-Cairo">
                    {step.title}
                  </h3>
                  <p className="text-lg text-foreground/70 font-Cairo leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
