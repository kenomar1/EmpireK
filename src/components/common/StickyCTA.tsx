import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

export default function StickyCTA() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 500px
      if (window.scrollY > 500 && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 md:bottom-0 left-0 right-0 z-50 p-4 md:p-6 mb-4 md:mb-0"
        >
          <div className="max-w-4xl mx-auto glass-panel premium-border rounded-2xl p-4 md:p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                  {t('stickyCTA.title', 'Ready to Start Your Project?')}
                </h3>
                <p className="text-sm text-muted-foreground hidden md:block">
                  {t('stickyCTA.subtitle', 'Get a free consultation and quote today')}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  className="shadow-lg"
                  asChild
                >
                  <a href="/contact">
                    {t('stickyCTA.cta', 'Get Started')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                
                <button
                  onClick={() => setIsDismissed(true)}
                  className="p-2 hover:bg-accent rounded-full transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
