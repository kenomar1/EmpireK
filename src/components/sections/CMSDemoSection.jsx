// src/components/ui/CMSDemoPage.tsx
"use client";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";

export default function CMSDemoSection() {
  const { i18n, t } = useTranslation();
  const cms = (key, options) => t(`cmsDemo.${key}`, options);

  const isRTL = i18n.language === "ar";

  return (
    <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br backdrop-blur-sm from-background/90 via-primary/20 to-background pt-32 pb-32">
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <Badge className="mb-6" variant="secondary">
            {cms("badge")}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-foreground">
            {cms("heading")}
          </h1>
          <p
            className="text-xl md:text-2xl text-foreground max-w-4xl font-semibold mx-auto leading-relaxed mb-12"
            dangerouslySetInnerHTML={{ __html: cms("subheading") }}
          />
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="text-lg px-10" asChild>
              <a href="#dashboard">{cms("ctaPrimary")}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16  px-6 bg-primary text-primary-foreground  relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            {cms("finalHeading")}
          </h2>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-12"
            asChild
          >
            <a href="/contact">{cms("finalCta")}</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
