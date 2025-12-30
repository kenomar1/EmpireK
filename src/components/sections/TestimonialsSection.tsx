import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  company?: string;
}

export default function TestimonialsSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const testimonials = t('gallery.testimonials', {
    returnObjects: true,
  }) as Testimonial[];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-muted text-muted'
        }`}
      />
    ));
  };

  // Generate avatar initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="py-16 md:py-24 px-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('gallery.testimonialsTitle')}
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel premium-border rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-16 h-16 text-primary" />
              </div>

              {/* Star Rating */}
              <div className="flex gap-1 mb-6 relative z-10">
                {renderStars(testimonial.rating)}
              </div>

              {/* Content */}
              <p className="text-foreground text-lg mb-8 leading-relaxed relative z-10">
                "{testimonial.content}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4 relative z-10">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/20">
                  <span className="text-primary font-bold text-lg">
                    {getInitials(testimonial.name)}
                  </span>
                </div>

                {/* Name and Role */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground truncate">
                    {testimonial.name}
                  </h4>
                  <p className="text-muted-foreground text-sm truncate">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground text-lg">
            {t('gallery.cta', 'Ready to start your project?')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
