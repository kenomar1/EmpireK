// components/Footer.tsx
"use client";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

type FooterKey =
  | "brandTitle"
  | "brandDesc"
  | "startProject"
  | "servicesTitle"
  | "services"
  | "contactTitle"
  | "email"
  | "phone"
  | "location"
  | "copyright"
  | "privacy"
  | "terms"
  | "cookies";

export default function Footer() {
  const { i18n, t } = useTranslation();
  const tf = (key: FooterKey, options?: Record<string, unknown>) =>
    t(`footer.${key}`, options);

  const isRTL = i18n.language === "ar";

  return (
    <footer
      className={`bg-background border-t border-border/50 ${
        isRTL ? "font-arabic" : ""
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Main Footer */}
      <div className="bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Brand Column */}
            <div className={isRTL ? "lg:col-start-3" : ""}>
              <h3 className="text-2xl font-bold mb-4">{tf("brandTitle")}</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {tf("brandDesc")}
              </p>
              <Button size="lg" className="group">
                {tf("startProject")}
                <ArrowRight
                  className={`h-4 w-4 transition-transform ${
                    isRTL
                      ? "mr-2 rotate-180 group-hover:-translate-x-1"
                      : "ml-2 group-hover:translate-x-1"
                  }`}
                />
              </Button>
            </div>

            {/* Services Column */}
            <div>
              <h4 className="font-semibold text-lg mb-6">
                {tf("servicesTitle")}
              </h4>
              <ul className="space-y-4 text-muted-foreground">
                {/* This is the correct, fully typed way to get arrays in i18next */}
                {(
                  tf("services", { returnObjects: true }) as unknown as string[]
                ).map((service) => (
                  <li key={service}>
                    <a
                      href="#"
                      className="hover:text-primary transition inline-block"
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div className={isRTL ? "lg:col-start-1 lg:row-start-1" : ""}>
              <h4 className="font-semibold text-lg mb-6">
                {tf("contactTitle")}
              </h4>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{tf("email")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <span dir="ltr">{tf("phone")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{tf("location")}</span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex gap-4 mt-8">
                {[Facebook, Twitter, Linkedin, Instagram, Youtube].map(
                  (Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-11 h-11 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Bar */}
      <div className="py-8 px-6">
        <div
          className={`max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground ${
            isRTL ? "md:flex-row-reverse" : ""
          }`}
        >
          <p>{tf("copyright")}</p>

          <div
            className={`flex gap-6 mt-4 md:mt-0 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <a href="#" className="hover:text-primary transition">
              {tf("privacy")}
            </a>
            <a href="#" className="hover:text-primary transition">
              {tf("terms")}
            </a>
            <a href="#" className="hover:text-primary transition">
              {tf("cookies")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
