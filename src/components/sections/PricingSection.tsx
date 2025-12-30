import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export default function PricingSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const tiers: PricingTier[] = [
    {
      name: t('pricing.starter.name'),
      price: t('pricing.starter.price'),
      period: t('pricing.starter.period'),
      description: t('pricing.starter.description'),
      features: t('pricing.starter.features', { returnObjects: true }) as string[],
    },
    {
      name: t('pricing.pro.name'),
      price: t('pricing.pro.price'),
      period: t('pricing.pro.period'),
      description: t('pricing.pro.description'),
      features: t('pricing.pro.features', { returnObjects: true }) as string[],
      popular: true,
    },
    {
      name: t('pricing.enterprise.name'),
      price: t('pricing.enterprise.price'),
      period: t('pricing.enterprise.period'),
      description: t('pricing.enterprise.description'),
      features: t('pricing.enterprise.features', { returnObjects: true }) as string[],
    },
  ];

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
            {t('pricing.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative glass-panel premium-border rounded-3xl p-8 ${
                tier.popular
                  ? 'ring-2 ring-primary shadow-2xl shadow-primary/20 scale-105'
                  : 'shadow-xl'
              }`}
            >
              {/* Most Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    {t('pricing.mostPopular')}
                  </div>
                </div>
              )}

              {/* Tier Name */}
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {tier.name}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground mb-6">
                {tier.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-foreground">
                    {tier.price}
                  </span>
                  {tier.period !== 'contact us' && tier.period !== 'تواصل معنا' && (
                    <span className="text-muted-foreground">
                      / {tier.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                asChild
                size="lg"
                variant={tier.popular ? 'default' : 'outline'}
                className="w-full"
              >
                <Link to="/contact">
                  {tier.price === 'Custom' || tier.price === 'مخصص'
                    ? t('pricing.contactUs')
                    : t('pricing.getStarted')}
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            {t('pricing.notFound')}
          </p>
          <Button asChild size="lg" variant="outline">
            <Link to="/contact">{t('pricing.customQuote')}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
