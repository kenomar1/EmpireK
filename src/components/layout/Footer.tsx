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
import { motion } from "framer-motion";

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
      className="relative my-8" // Extra top margin to separate from content
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Floating Glassmorphic Footer Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-4 md:mx-8 lg:mx-auto max-w-7xl"
      >
        <div className="bg-background/70 backdrop-blur-xl border border-border/30 rounded-3xl shadow-2xl overflow-hidden">
          {/* Main Footer Content */}
          <div className="py-16 px-8 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {/* Brand Column */}
              <div className={isRTL ? "lg:col-start-3" : ""}>
                <a
                  href="/"
                  className="text-4xl tracking-widest font-thin font-Bebas inline-block mb-6"
                >
                  <span className="text-foreground">Empire</span>
                  <span className="text-primary">-K</span>
                </a>
                <p className="text-muted-foreground mb-8 max-w-md text-lg leading-relaxed">
                  {tf("brandDesc")}
                </p>
                <Button size="lg" className="group shadow-lg">
                  {tf("startProject")}
                  <ArrowRight
                    className={`h-5 w-5 transition-transform ${
                      isRTL
                        ? "mr-3 group-hover:-translate-x-2"
                        : "ml-3 group-hover:translate-x-2"
                    }`}
                  />
                </Button>
              </div>

              {/* Services Column */}
              <div>
                <h4 className="font-semibold text-xl mb-8 text-foreground">
                  {tf("servicesTitle")}
                </h4>
                <ul className="space-y-5 text-muted-foreground text-lg">
                  {(
                    tf("services", {
                      returnObjects: true,
                    }) as unknown as string[]
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
                <h4 className="font-semibold text-xl mb-8 text-foreground">
                  {tf("contactTitle")}
                </h4>
                <div className="space-y-6 text-muted-foreground text-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <span>{tf("email")}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <span dir="ltr">{tf("phone")}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <span>{tf("location")}</span>
                  </div>
                </div>

                {/* Social Icons */}
                <div className="flex gap-4 mt-10">
                  {[Facebook, Twitter, Linkedin, Instagram, Youtube].map(
                    (Icon, i) => (
                      <a
                        key={i}
                        href="#"
                        className="w-14 h-14 rounded-2xl bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-xl hover:scale-110"
                      >
                        <Icon className="w-6 h-6" />
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Bottom Bar */}
          <div className="py-8 px-8 lg:px-16">
            <div
              className={`flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-6 ${
                isRTL ? "md:flex-row-reverse" : ""
              }`}
            >
              <p>{tf("copyright")}</p>

              <div className={`flex gap-8 ${isRTL ? "flex-row-reverse" : ""}`}>
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
        </div>
      </motion.div>
    </footer>
  );
}