// components/layout/Footer.tsx
"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Cookie, Shield, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

type ModalType = "privacy" | "terms" | "cookies" | null;

export default function Footer() {
  const { i18n, t } = useTranslation(); // Default namespace: translation
  const tf = (key: string) => t(`footer.${key}`);

  const isRTL = i18n.language === "ar";

  const [openModal, setOpenModal] = useState<ModalType>(null);

  const handleCookiesAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setOpenModal(null);
    toast.success(t("footer.cookiesAccepted") || "Cookies accepted 🍪");
  };

  // Get full object for the current modal (title + content array)
  const modalData = openModal
    ? (t(openModal, { returnObjects: true }) as {
        title: string;
        content: string[];
      })
    : null;

  return (
    <>
      <footer className="relative my-8" dir={isRTL ? "rtl" : "ltr"}>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-4 md:mx-8 lg:mx-auto max-w-7xl"
        >
          <div className="glass-panel premium-border shadow-2xl overflow-hidden rounded-[2.5rem]">
            {/* Brand, Services, Contact — unchanged */}
            <div className="py-16 px-8 lg:px-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                {/* Brand Column */}
                <div className={isRTL ? "lg:col-start-3" : ""}>
                  <a
                    href="/"
                    className="text-4xl tracking-widest font-thin font-Bebas inline-block mb-6"
                  >
                    <span className="text-foreground">{t("common.brandNamePrefix")}</span>
                    <span className="text-primary">{t("common.brandNameSuffix")}</span>
                  </a>
                  <p className="text-muted-foreground mb-8 max-w-md text-lg leading-relaxed">
                    {tf("brandDesc")}
                  </p>
                  <Button size="lg" className="group shadow-lg" asChild>
                    <a href="/contact">{tf("startProject")}</a>
                  </Button>
                </div>

                {/* Services Column */}
                <div>
                  <h4 className="font-semibold text-xl mb-8 text-foreground">
                    {tf("servicesTitle")}
                  </h4>
                  <ul className="space-y-5 text-muted-foreground text-lg">
                    {(
                      t("footer.services", { returnObjects: true }) as string[]
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
                      <span>{tf("email")}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span dir="ltr">{tf("phone")}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{tf("location")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="py-8 px-8 lg:px-16 border-t border-border/50">
              <div
                className={`flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-6 ${isRTL ? "md:flex-row-reverse" : ""}`}
              >
                <p>{t("common.copyright", { year: new Date().getFullYear() })}</p>

                <div
                  className={`flex gap-8 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <button
                    onClick={() => setOpenModal("privacy")}
                    className="hover:text-primary transition flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    {tf("privacy")}
                  </button>
                  <button
                    onClick={() => setOpenModal("terms")}
                    className="hover:text-primary transition flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    {tf("terms")}
                  </button>
                  <button
                    onClick={() => setOpenModal("cookies")}
                    className="hover:text-primary transition flex items-center gap-2"
                  >
                    <Cookie className="w-4 h-4" />
                    {tf("cookies")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </footer>

      {/* Legal Modals */}
      <Dialog open={!!openModal} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              {openModal === "privacy" && (
                <Shield className="w-8 h-8 text-primary" />
              )}
              {openModal === "terms" && (
                <FileText className="w-8 h-8 text-primary" />
              )}
              {openModal === "cookies" && (
                <Cookie className="w-8 h-8 text-primary" />
              )}
              {modalData?.title || ""}
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="text-base leading-relaxed mt-6 space-y-5 prose prose-lg dark:prose-invert max-w-none">
            {Array.isArray(modalData?.content) ? (
              modalData.content.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p>No content available.</p>
            )}
          </DialogDescription>

          {/* Cookies — "Okay" button */}
          {openModal === "cookies" && (
            <DialogFooter className="mt-8">
              <Button
                onClick={handleCookiesAccept}
                className="w-full sm:w-auto"
              >
                {t("iaccept")}
              </Button>
            </DialogFooter>
          )}

          {/* Privacy & Terms — "Close" */}
          {(openModal === "privacy" || openModal === "terms") && (
            <DialogFooter className="mt-8">
              <Button onClick={() => setOpenModal(null)}>{t("close")}</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}