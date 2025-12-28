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
  const { i18n, t } = useTranslation();
  const tf = (key: string) => t(`footer.${key}`);

  const isRTL = i18n.language === "ar";

  const [openModal, setOpenModal] = useState<ModalType>(null);

  const handleCookiesAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setOpenModal(null);
    toast.success(t("footer.cookiesAccepted") || "Cookies accepted 🍪");
  };

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
          <div className="bg-background/70 backdrop-blur-xl border border-border/30 rounded-3xl shadow-2xl overflow-hidden">
            <div className="py-16 px-8 lg:px-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                {/* Brand */}
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
                  <Button size="lg" className="group shadow-lg" asChild>
                    <a href="/contact">{tf("startProject")}</a>
                  </Button>
                </div>

                {/* Services */}
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

                {/* Contact */}
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

            <div className="py-8 px-8 lg:px-16 border-t border-border/50">
              <div
                className={`flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-6 ${isRTL ? "md:flex-row-reverse" : ""}`}
              >
                <p>{tf("copyright")}</p>
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

      <Dialog open={!!openModal} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-2xl">
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
              {openModal && tf(openModal)}
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="text-base leading-relaxed mt-6 space-y-4">
            {openModal === "privacy" && <p>Your privacy policy content...</p>}
            {openModal === "terms" && <p>Your terms of service content...</p>}
            {openModal === "cookies" && (
              <>
                <p>
                  We use cookies to enhance your experience, analyze site
                  traffic, and deliver personalized content.
                </p>
                <p>
                  By continuing to use this site, you agree to our use of
                  cookies.
                </p>
              </>
            )}
          </DialogDescription>

          {openModal === "cookies" && (
            <DialogFooter className="mt-8">
              <Button
                onClick={handleCookiesAccept}
                className="w-full sm:w-auto"
              >
                Okay
              </Button>
            </DialogFooter>
          )}

          {(openModal === "privacy" || openModal === "terms") && (
            <DialogFooter className="mt-8">
              <Button onClick={() => setOpenModal(null)}>Close</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
