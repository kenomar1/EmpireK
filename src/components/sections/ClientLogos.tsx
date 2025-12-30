import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { client } from '../../lib/sanityClient';

interface ClientLogo {
  _id: string;
  name: string;
  logo: {
    asset: {
      url: string;
    };
  };
  website?: string;
  order: number;
}

export default function ClientLogos() {
  const { t } = useTranslation();
  const [logos, setLogos] = useState<ClientLogo[]>([]);

  useEffect(() => {
    const query = `*[_type == "clientLogo" && isActive == true] | order(order asc) {
      _id,
      name,
      logo {
        asset-> {
          url
        }
      },
      website,
      order
    }`;

    client.fetch(query).then((data: ClientLogo[]) => setLogos(data));
  }, []);

  if (logos.length === 0) return null;

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('clientLogos.title', 'Trusted by Leading Brands')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('clientLogos.subtitle', 'Join hundreds of satisfied clients who trust us with their digital presence')}
          </p>
        </motion.div>

        {/* Infinite Scroll Marquee */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
          
          <motion.div
            className="flex gap-12 md:gap-16"
            animate={{
              x: [0, -100 * logos.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo._id}-${index}`}
                className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 flex items-center justify-center"
              >
                {logo.website ? (
                  <a
                    href={logo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <img
                      src={logo.logo.asset.url}
                      alt={logo.name}
                      className="w-full h-full object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                    />
                  </a>
                ) : (
                  <img
                    src={logo.logo.asset.url}
                    alt={logo.name}
                    className="w-full h-full object-contain grayscale opacity-60"
                  />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
