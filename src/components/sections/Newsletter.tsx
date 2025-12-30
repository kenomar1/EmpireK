import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

export default function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // TODO: Integrate with EmailJS or your email service
    // For now, just simulate success
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="py-12 px-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel premium-border rounded-3xl p-8 md:p-12 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          {t('newsletter.title', 'Stay Updated')}
        </h3>
        
        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
          {t('newsletter.subtitle', 'Get the latest insights, tips, and exclusive offers delivered to your inbox')}
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletter.placeholder', 'Enter your email')}
              required
              disabled={status === 'loading' || status === 'success'}
              className="flex-1 px-6 py-4 rounded-full bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <Button
              type="submit"
              size="lg"
              disabled={status === 'loading' || status === 'success'}
              className="px-8 rounded-full"
            >
              {status === 'loading' ? (
                t('newsletter.sending', 'Sending...')
              ) : status === 'success' ? (
                t('newsletter.success', 'Subscribed!')
              ) : (
                <>
                  {t('newsletter.subscribe', 'Subscribe')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
          
          {status === 'error' && (
            <p className="text-destructive text-sm mt-3">
              {t('newsletter.error', 'Something went wrong. Please try again.')}
            </p>
          )}
        </form>

        <p className="text-muted-foreground text-sm mt-6">
          {t('newsletter.privacy', 'We respect your privacy. Unsubscribe at any time.')}
        </p>
      </motion.div>
    </div>
  );
}
