import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Target, Users, Lightbulb, Shield, Linkedin, Twitter, Github, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import StatsCounter from '../components/sections/StatsCounter';
import { client, urlFor } from '../lib/sanityClient';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  avatar?: { asset?: { url: string } };
  linkedin?: string;
  twitter?: string;
  github?: string;
  email?: string;
}

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Now fetching from 'author' schema as per user request
    const query = `*[_type == "author"] | order(_createdAt asc) {
      _id,
      name,
      role,
      bio,
      avatar { asset-> { url } },
      linkedin,
      twitter,
      github,
      email
    }`;

    client
      .fetch<TeamMember[]>(query)
      .then((data) => {
        setTeam(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const values = t('about.values.items', { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;

  const valueIcons = [Target, Users, Lightbulb, Shield];

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
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-foreground mb-6">
              {t('about.title')}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </motion.div>
        </section>

        {/* Stats Section */}
        <StatsCounter />

        {/* Our Story */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel premium-border rounded-3xl p-8 md:p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t('about.story.title')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('about.story.content')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center glass-panel premium-border rounded-3xl p-8 md:p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t('about.mission.title')}
              </h2>
              <p className="text-muted-foreground text-xl leading-relaxed">
                {t('about.mission.content')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('about.values.title')}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = valueIcons[index] || Target;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel premium-border rounded-3xl p-6 text-center hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('team.title')}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t('team.subtitle')}
              </p>
            </motion.div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('common.loading')}</p>
              </div>
            ) : team.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">{t('team.noTeam')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {team.map((member, index) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel premium-border rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Photo */}
                    {member.avatar?.asset?.url ? (
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={urlFor(member.avatar).width(400).height(400).fit('crop').url()}
                          alt={member.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <span className="text-6xl font-bold text-primary/30">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {member.name}
                      </h3>
                      <p className="text-primary font-semibold mb-4">
                        {member.role}
                      </p>
                      {member.bio && (
                        <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                          {member.bio}
                        </p>
                      )}

                      {/* Social Links */}
                      <div className="flex gap-3">
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {member.twitter && (
                          <a
                            href={member.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
                        {member.github && (
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            <Mail className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel premium-border rounded-3xl p-12 bg-gradient-to-br from-primary/10 to-primary/5"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('about.cta')}
              </h2>
              <Button asChild size="lg">
                <Link to="/contact">{t('about.ctaButton')}</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
