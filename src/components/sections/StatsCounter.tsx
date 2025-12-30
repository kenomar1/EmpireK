import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Users, Calendar, TrendingUp } from 'lucide-react';
import { client } from '../../lib/sanityClient';

interface Stats {
  projectsCompleted: number;
  happyClients: number;
  yearsExperience: number;
  successRate: number;
}

function Counter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return <span ref={ref}>{count}</span>;
}

export default function StatsCounter() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const query = `*[_type == "siteStats" && isActive == true][0] {
      projectsCompleted,
      happyClients,
      yearsExperience,
      successRate
    }`;

    client.fetch(query).then((data: Stats) => setStats(data));
  }, []);

  if (!stats) return null;

  const statsData = [
    {
      icon: Briefcase,
      value: stats.projectsCompleted,
      label: t('stats.projects', 'Projects Completed'),
      suffix: '+',
    },
    {
      icon: Users,
      value: stats.happyClients,
      label: t('stats.clients', 'Happy Clients'),
      suffix: '+',
    },
    {
      icon: Calendar,
      value: stats.yearsExperience,
      label: t('stats.years', 'Years Experience'),
      suffix: '+',
    },
    {
      icon: TrendingUp,
      value: stats.successRate,
      label: t('stats.success', 'Success Rate'),
      suffix: '%',
    },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 mb-4">
                <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2">
                <Counter end={stat.value} />
                {stat.suffix}
              </div>
              <p className="text-muted-foreground text-sm md:text-base font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
