// src/pages/ContactPage.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Send,
  ArrowRight,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

// Schemas with translation keys for errors
const contactSchema = z.object({
  name: z.string().min(2, "contact.nameError"),
  email: z.string().email("contact.emailError"),
  phone: z.string().min(8, "contact.phoneError"),
  message: z.string().min(10, "contact.messageError"),
});

const bookCallSchema = z.object({
  bookName: z.string().min(2, "contact.bookNameError"),
  bookEmail: z.string().email("contact.bookEmailError"),
  bookPhone: z.string().min(8, "contact.bookPhoneError"),
  bookDate: z.string().min(1, "contact.bookDateError"),
  bookTime: z.string().min(1, "contact.bookTimeError"),
});

type ContactData = z.infer<typeof contactSchema>;
type BookCallData = z.infer<typeof bookCallSchema>;

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [isBookCallOpen, setIsBookCallOpen] = useState(false);

  // EmailJS Config
  const SERVICE_ID = "service_m39usn4";
  const PUBLIC_KEY = "ofqwp3aOWL95jfQDh";
  const TEMPLATE_CONTACT = "template_5q89g6c";
  const TEMPLATE_BOOK_CALL = "your_book_call_template_id"; // Replace with your actual ID

  // Contact Form
  const {
    register: registerContact,
    handleSubmit: handleContactSubmit,
    formState: { errors: contactErrors, isSubmitting: contactSubmitting },
    reset: resetContact,
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  });

  // Book Call Form
  const {
    register: registerBook,
    handleSubmit: handleBookSubmit,
    formState: { errors: bookErrors, isSubmitting: bookSubmitting },
    reset: resetBook,
  } = useForm<BookCallData>({
    resolver: zodResolver(bookCallSchema),
  });

  const onContactSubmit = async (data: ContactData) => {
    const currentTime = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_CONTACT,
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          time: currentTime,
        },
        PUBLIC_KEY
      );

      toast.success(t("contact.success"));
      resetContact();
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error(t("contact.error"));
    }
  };

  const onBookCallSubmit = async (data: BookCallData) => {
    const preferredDateTime = `${data.bookDate} at ${data.bookTime}`;

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_BOOK_CALL,
        {
          name: data.bookName,
          email: data.bookEmail,
          phone: data.bookPhone,
          preferred_time: preferredDateTime,
        },
        PUBLIC_KEY
      );

      toast.success(t("contact.bookSuccess"));
      resetBook();
      setIsBookCallOpen(false);
    } catch (error) {
      console.error("Book Call Error:", error);
      toast.error(t("contact.bookError"));
    }
  };

  return (
    <>
      <div
        className="min-h-screen  bg-gradient-to-br from-background via-muted/20 to-background py-20 px-6"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl  font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text py-4 text-transparent">
              {t("contact.heroTitle")}
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("contact.heroSubtitle")}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-border/50"
            >
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Send className="w-8 h-8 text-primary" />
                {t("contact.formTitle")}
              </h2>

              <form
                onSubmit={handleContactSubmit(onContactSubmit)}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("contact.name")}
                  </label>
                  <input
                    {...registerContact("name")}
                    className="w-full px-5 py-4 rounded-xl bg-background/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder={t("contact.namePlaceholder")}
                  />
                  {contactErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {t(contactErrors.name.message!)}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("contact.email")}
                    </label>
                    <input
                      {...registerContact("email")}
                      type="email"
                      className="w-full px-5 py-4 rounded-xl bg-background/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="name@provider.com"
                    />
                    {contactErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {t(contactErrors.email.message!)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("contact.phone")}
                    </label>
                    <input
                      {...registerContact("phone")}
                      type="tel"
                      className="w-full px-5 py-4 rounded-xl bg-background/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="+201515912781"
                    />
                    {contactErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {t(contactErrors.phone.message!)}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("contact.message")}
                  </label>
                  <textarea
                    {...registerContact("message")}
                    rows={6}
                    className="w-full px-5 py-4 rounded-xl bg-background/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    placeholder={t("contact.messagePlaceholder")}
                  />
                  {contactErrors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {t(contactErrors.message.message!)}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full py-5 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {contactSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      {t("contact.sending")}
                    </>
                  ) : (
                    <>
                      {t("contact.sendButton")}
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Right Column */}
            <div className="space-y-12">
              {/* Book a Call */}
              <motion.div
                initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-3xl p-8 lg:p-12 shadow-2xl border border-primary/20"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-primary/20 rounded-2xl">
                    <Calendar className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">
                    {t("contact.scheduleTitle")}
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground mb-8">
                  {t("contact.scheduleDesc")}
                </p>

                <button
                  onClick={() => setIsBookCallOpen(true)}
                  className="inline-flex items-center gap-3 px-8 py-5 bg-primary text-primary-foreground rounded-full font-bold text-lg shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
                >
                  {t("contact.bookCall")}
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="mt-8 p-6 bg-background/50 rounded-2xl text-sm text-muted-foreground">
                  {t("contact.noObligation")}
                </div>
              </motion.div>

              {/* Contact Details */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-border/50"
              >
                <h3 className="text-2xl font-bold mb-8">
                  {t("contact.detailsTitle")}
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-5">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{t("contact.email")}</p>
                      <a
                        href="mailto:dev.empirek@hotmail.com"
                        className="text-primary hover:underline"
                      >
                        dev.empirek@hotmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{t("contact.phone")}</p>
                      <a
                        href="tel:+201515912781"
                        dir="ltr"
                        className="inline-flex items-center gap-2 text-primary hover:underline font-medium transition-colors"
                      >
                        {t("contact.phonenum")}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{t("contact.location")}</p>
                      <p className="text-muted-foreground">
                        {t("contact.ourlocation")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-10 pt-8 border-t border-border/50 text-sm text-muted-foreground">
                  {t("contact.responseTime")}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Book a Call Modal */}
      {isBookCallOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-2xl bg-card rounded-3xl shadow-2xl p-8"
          >
            <button
              onClick={() => setIsBookCallOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              {t("contact.bookCall")}
            </h2>

            <form
              onSubmit={handleBookSubmit(onBookCallSubmit)}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("contact.name")}
                </label>
                <input
                  {...registerBook("bookName")}
                  className="w-full px-5 py-4 rounded-xl bg-background/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder={t("contact.namePlaceholder")}
                />
                {bookErrors.bookName && (
                  <p className="text-red-500 text-sm mt-1">
                    {t(bookErrors.bookName.message!)}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("contact.email")}
                  </label>
                  <input
                    {...registerBook("bookEmail")}
                    type="email"
                    className="w-full px-5 py-4 rounded-xl bg-background/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="name@company.com"
                  />
                  {bookErrors.bookEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {t(bookErrors.bookEmail.message!)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("contact.phone")}
                  </label>
                  <input
                    {...registerBook("bookPhone")}
                    type="tel"
                    className="w-full px-5 py-4 rounded-xl bg-background/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="+20 1515912781"
                  />
                  {bookErrors.bookPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {t(bookErrors.bookPhone.message!)}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("contact.bookDateLabel")}
                  </label>
                  <input
                    {...registerBook("bookDate")}
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-5 py-4 rounded-xl bg-background/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  {bookErrors.bookDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {t(bookErrors.bookDate.message!)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("contact.bookTimeLabel")}
                  </label>
                  <input
                    {...registerBook("bookTime")}
                    type="time"
                    className="w-full px-5 py-4 rounded-xl bg-background/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  {bookErrors.bookTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {t(bookErrors.bookTime.message!)}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={bookSubmitting}
                className="w-full py-5 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {bookSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {t("contact.sending")}
                  </>
                ) : (
                  <>
                    {t("contact.bookButton")}
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}