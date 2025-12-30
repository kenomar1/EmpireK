import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { client } from '../lib/sanityClient';
import Footer from '../components/layout/Footer';
import toast from 'react-hot-toast';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export default function FAQPage() {
  const { t, i18n } = useTranslation();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const query = `*[_type == "faq" && isActive == true] | order(order asc) {
      _id,
      question,
      answer,
      category,
      order
    }`;

    client.fetch(query).then((data: FAQ[]) => setFaqs(data));
  }, []);

  const categories = [
    { value: 'all', label: t('faq.categories.all', 'All') },
    { value: 'general', label: t('faq.categories.general', 'General') },
    { value: 'pricing', label: t('faq.categories.pricing', 'Pricing') },
    { value: 'process', label: t('faq.categories.process', 'Process') },
    { value: 'technical', label: t('faq.categories.technical', 'Technical') },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <main className="font-cairo overflow-x-hidden">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6">
              {t('faq.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              {t('faq.subtitle')}
            </p>
          </motion.div>
        </section>

        {/* FAQ Content */}
        <section className="py-8 px-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('faq.searchPlaceholder', 'Search questions...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </motion.div>

            {/* Category Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-3 mb-12 justify-center"
            >
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setActiveCategory(category.value)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeCategory === category.value
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-background/50 text-foreground hover:bg-background border border-border'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </motion.div>

            {/* FAQ List */}
            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={faq._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-panel premium-border rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="font-bold text-foreground text-lg pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {t('faq.noResults', 'No questions found. Try a different search or category.')}
                </p>
              </div>
            )}

            {/* Ask Question Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 text-center glass-panel premium-border rounded-3xl p-12"
            >
              <h3 className="text-3xl font-bold text-foreground mb-4">
                {t('faq.askQuestion', "Didn't find your answer?")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t('faq.askQuestionSubtitle', 'Submit your question and our team will get back to you')}
              </p>
              
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const question = formData.get('question') as string;
                  
                  if (!question.trim()) {
                    toast.error(t('faq.questionRequired', 'Please enter a question'));
                    return;
                  }
                  
                  try {
                    await client.create({
                      _type: 'faq',
                      question: question,
                      category: 'general',
                      status: 'pending',
                      isActive: false,
                      submittedAt: new Date().toISOString(),
                    });
                    
                    toast.success(t('faq.questionSubmitted', 'Thank you! Your question has been submitted.'));
                    e.currentTarget.reset();
                  } catch (error) {
                    console.error(error);
                    toast.error(t('faq.questionError', 'Failed to submit question. Please try again.'));
                  }
                }}
                className="max-w-2xl mx-auto"
              >
                <div className="flex gap-3">
                  <input
                    type="text"
                    name="question"
                    placeholder={t('faq.yourQuestion', 'Type your question here...')}
                    required
                    className="flex-1 px-6 py-4 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-lg whitespace-nowrap"
                  >
                    {t('faq.submitQuestion', 'Submit')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
