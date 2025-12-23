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
    <section className="py-20 px-6 bg-background " dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {heading}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
                  className="flex flex-col items-center text-center group"
                >
                  {/* Number Circle */}
                  <div className="relative z-10 mb-8">
                    <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                      {step.number}
                    </div>
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary/20 blur-xl group-hover:blur-2xl transition-all" />
                  </div>

                  {/* Icon */}
                  <div className="mb-6 p-4 rounded-2xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground max-w-xs">
                    {step.description}
                  </p>

                  {/* Arrow between steps */}
                  {index < steps.length - 1 && (
                    <ArrowRight
                      className={`absolute top-0 hidden xl:block text-primary/30 ${
                        isRTL ? "-left-12 rotate-180" : "-right-12"
                      }`}
                      size={48}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="lg:hidden space-y-12">
          {steps.map((step, index) => {
            const Icon = iconMap[step.icon] || Target;
            return (
              <div key={index} className="relative flex gap-6">
                {/* Timeline Line */}
                {index !== steps.length - 1 && (
                  <div className="absolute left-10 top-20 bottom-0 w-0.5 bg-border/50" />
                )}

                {/* Circle + Number */}
                <div className="relative z-10 shrink-0">
                  <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center text-3xl font-bold text-primary">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="mb-4 p-3 rounded-xl bg-primary/5 inline-block">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
