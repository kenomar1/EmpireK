// src/components/ui/navBar.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, Globe, Check } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import { useTranslation } from "react-i18next";
import { Magnetic } from "../ui/magnetic";

export function FixedNavbar() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const currentLang = i18n.language as "en" | "ar";
  const isRTL = currentLang === "ar";

  const navItems = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.services"), href: "/services" },
    { name: t("nav.gallery"), href: "/gallery" },
    { name: t("nav.contact"), href: "/contact" },
    { name: t("nav.blog"), href: "/blog" },
  ];

  const languages = [
    { code: "en", native: "English" },
    { code: "ar", native: "العربية" },
  ] as const;

  const handleLanguageChange = (newLocale: "en" | "ar") => {
    i18n.changeLanguage(newLocale);
    setLangOpen(false);
    setOpen(false);
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navbarVariants: Variants = {
    visible: {
      y: 32, // Increased top spacing when visible (≈ pt-8)
      opacity: 1,
      transition: {
        y: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    },
    hidden: {
      y: -120,
      opacity: 0,
      transition: {
        y: { type: "spring", stiffness: 300, damping: 35 },
        opacity: { duration: 0.2 },
      },
    },
  };

  return (
    <>
      {/* Navbar with increased top spacing */}
      <motion.header
        key={currentLang}
        dir={isRTL ? "rtl" : "ltr"}
        className="fixed inset-x-0 top-0 z-50 px-4 md:px-8 pointer-events-none"
        variants={navbarVariants}
        initial="visible"
        animate={visible ? "visible" : "hidden"}
      >
        <div className="mx-auto max-w-5xl pointer-events-auto">
          <div className="glass-panel border-white/10 rounded-full px-6 py-2 premium-border overflow-visible">
            <div className="flex h-14 items-center justify-between">
              {/* Desktop: Logo left, Nav center, Controls right */}
              <div className="hidden md:flex items-center justify-between w-full">
                {/* Left: Logo */}
                <Magnetic>
                  <a
                    href="/"
                    dir="ltr"
                    className="text-2xl tracking-widest font-thin font-Bebas flex items-center"
                  >
                    <span className="text-foreground">{t("common.brandNamePrefix")}</span>
                    <span className="text-primary">{t("common.brandNameSuffix")}</span>
                  </a>
                </Magnetic>

                {/* Center: Navigation Links */}
                <nav className="flex items-center gap-10">
                  {navItems.map((item) => (
                    <Magnetic key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </a>
                    </Magnetic>
                  ))}
                </nav>

                {/* Right: Theme Toggle + Language */}
                <div className="flex items-center gap-4">
                  <ThemeToggle />

                  <div className="relative">
                    <button
                      onClick={() => setLangOpen(!langOpen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent/50 hover:bg-accent transition-all"
                    >
                      <Globe className="w-4 h-4" />
                      <span>
                        {currentLang === "en" ? "English" : "العربية"}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${langOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {langOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-48 bg-card rounded-2xl shadow-2xl border border-border/50 z-50 overflow-hidden"
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full px-5 py-3 text-sm flex items-center justify-between transition-colors hover:bg-accent ${
                              currentLang === lang.code ? "bg-accent/50" : ""
                            }`}
                          >
                            <span>{lang.native}</span>
                            {currentLang === lang.code && (
                              <Check className="w-4 h-4 text-primary" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile: Theme left — Logo center — Menu right */}
              <div className="flex items-center justify-between w-full md:hidden">
                <ThemeToggle />

                <a
                  href="/"
                  className="absolute left-1/2 -translate-x-1/2 text-2xl tracking-widest font-thin font-bebas whitespace-nowrap"
                >
                  <span className="text-foreground">{t("common.brandNamePrefix")}</span>
                  <span className="text-primary">{t("common.brandNameSuffix")}</span>
                </a>

                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-accent/50 "
                    >
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>

                  <SheetContent
                    side={isRTL ? "left" : "right"}
                    className="w-96 bg-background/30 rounded-l-3xl backdrop-blur-sm border-border/50 shadow-2xl"
                  >
                    <div className="flex flex-col h-full py-8 px-6">
                      {/* Logo */}
                      <div className="mb-12">
                        <a
                          href="/"
                          className="inline-block"
                          onClick={() => setOpen(false)}
                        >
                          <h1 className="text-4xl tracking-widest font-Bebas leading-none">
                            <span className="text-foreground">{t("common.brandNamePrefix")}</span>
                            <span className="text-primary">{t("common.brandNameSuffix")}</span>
                          </h1>
                          <p className="text-sm text-foreground/60 mt-2 tracking-wide font-Cairo">
                            {t("hero.heading")}
                          </p>
                        </a>
                      </div>

                      {/* Navigation */}
                      <nav className="flex-1">
                        <ul className="space-y-2">
                          {navItems.map((item, index) => (
                            <li key={item.name}>
                              <a
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`
                  group flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-medium
                  transition-all duration-300
                  ${
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-foreground/70 hover:text-foreground hover:bg-accent/50 hover:translate-x-2"
                  }
                `}
                              >

                                <span>{item.name}</span>
                                {location.pathname === item.href && (
                                  <motion.div
                                    layoutId="activeNavIndicator"
                                    className="ml-auto w-2 h-2 bg-primary-foreground rounded-full"
                                  />
                                )}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </nav>

                      {/* Language Selector */}
                      <div className="border-t border-border/30 pt-8">
                        <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                          {t("language")}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => handleLanguageChange(lang.code)}
                              className={`
                relative px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-300
                overflow-hidden group
                ${
                  currentLang === lang.code
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-accent/30 hover:bg-accent/60 text-foreground/80"
                }
              `}
                            >
                              <span className="relative z-10">
                                {lang.native}
                              </span>
                              {currentLang === lang.code && (
                                <motion.div
                                  layoutId="activeLangBg"
                                  className="absolute inset-0 bg-primary"
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Optional Footer Touch */}
                      <div className="mt-12 text-center">
                        <p className="text-xs text-muted-foreground">
                          {t("common.copyright", { year: new Date().getFullYear() })}
                        </p>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}