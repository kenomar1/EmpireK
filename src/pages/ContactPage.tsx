// src/pages/ContactPage.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Calendar, Send, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser"; // ← EmailJS SDK

const formSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(8, "رقم الجوال قصير جدًا"),
  message: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    // ← REPLACE THESE WITH YOUR ACTUAL EMAILJS VALUES
    const SERVICE_ID = "service_m39usn4"; // e.g., service_abc123
    const TEMPLATE_ID = "template_5q89g6c"; // e.g., template_xyz789
    const PUBLIC_KEY = "ofqwp3aOWL95jfQDh"; // Your EmailJS User ID

    // Generate current timestamp in a nice format
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
        TEMPLATE_ID,
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          time: currentTime, // ← For {{time}} in template
        },
        PUBLIC_KEY
      );

      toast.success(t("contact.success") || "تم إرسال الرسالة بنجاح!");
      reset();
    } catch (error: any) {
      console.error("EmailJS Error:", error);
      toast.error("فشل إرسال الرسالة، حاول مرة أخرى.");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-20 px-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text py-4 text-transparent">
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("contact.name")}
                </label>
                <input
                  {...register("name")}
                  className="w-full px-5 py-4 rounded-xl bg-background/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder={t("contact.namePlaceholder")}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email & Phone */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("contact.email")}
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full px-5 py-4 rounded-xl bg-background/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="name@company.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("contact.phone")}
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    className="w-full px-5 py-4 rounded-xl bg-background/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="+971 50 123 4567"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("contact.message")}
                </label>
                <textarea
                  {...register("message")}
                  rows={6}
                  className="w-full px-5 py-4 rounded-xl bg-background/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  placeholder={t("contact.messagePlaceholder")}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {t("contact.sending") || "جاري الإرسال..."}
                  </>
                ) : (
                  <>
                    {t("contact.sendButton") || "إرسال الرسالة"}
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right Column - Unchanged */}
          <div className="space-y-12">
            {/* Schedule Call */}
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
              <a
                href="https://calendly.com/yourname/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-5 bg-primary text-primary-foreground rounded-full font-bold text-lg shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
              >
                {t("contact.bookCall")}
                <ArrowRight className="w-5 h-5" />
              </a>
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
                      dir="ltr"
                      href="tel:+971501234567"
                      className="text-primary hover:underline"
                    >
                      +971 50 123 4567
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
  );
}