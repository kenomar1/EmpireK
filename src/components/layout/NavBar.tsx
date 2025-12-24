// src/components/ui/navBar.tsx
"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, Globe, Check } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import { useTranslation } from "react-i18next";

export function FixedNavbar() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

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

  return (
    <header
      key={currentLang}
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed inset-x-0 top-0 z-50 pt-6 px-4 md:px-8"
    >
      {/* Centered rounded pill navbar */}
      <div className="mx-auto max-w-5xl">
        <div className="bg-background/80  border border-border/20 rounded-full shadow-2xl px-6 py-2">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <a
              href="/"
              className="text-2xl tracking-widest font-thin font-Bebas flex items-center"
            >
              <span className="text-foreground">Empire</span>
              <span className="text-primary">K</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.name}
                </a>
              ))}

              <div className="flex items-center gap-4">
                <ThemeToggle />

                {/* Desktop Language Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setLangOpen(!langOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent/50 hover:bg-accent transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    <span>{currentLang === "en" ? "English" : "العربية"}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        langOpen ? "rotate-180" : ""
                      }`}
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
                    <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-48 bg-card rounded-2xl shadow-2xl border border-border/50 z-50 overflow-hidden">
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
                    </div>
                  )}
                </div>
              </div>
            </nav>

            {/* Mobile Right Side: Theme Toggle + Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
              {/* Theme Toggle visible on mobile outside the sheet */}
              <ThemeToggle />

              {/* Mobile Menu Trigger */}
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side={isRTL ? "left" : "right"}
                  className="w-80 bg-background/20 backdrop-blur-sm"
                >
                  <div className="flex flex-col gap-8 mt-6">
                    <a href="/" className="text-2xl tracking-widest font-Bebas">
                      <span className="text-foreground">Empire</span>
                      <span className="text-primary">K</span>
                    </a>

                    <nav className="flex flex-col gap-6">
                      {navItems.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="text-lg font-medium text-foreground/80 hover:text-foreground"
                        >
                          {item.name}
                        </a>
                      ))}
                    </nav>

                    {/* Only Language switcher inside mobile menu now */}
                    <div className="space-y-6 border-t border-border/50 pt-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-muted-foreground">
                          Language
                        </span>
                        <div className="grid grid-cols-2 gap-3">
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => handleLanguageChange(lang.code)}
                              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                currentLang === lang.code
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-accent/50 hover:bg-accent"
                              }`}
                            >
                              {lang.native}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}