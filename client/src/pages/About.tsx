import { motion } from 'framer-motion';
import { Layout } from '@/components/layout';
import { Compare } from '@/components/ui/compare';
import broken from '@/assets/broken.png';
import bigGarden from '@/assets/hero-garden6.jpg';
import ma from '@/assets/ma.png';
import baba from '@/assets/baba.png';
import me from '@/assets/me.png';
import jeja from '@/assets/jeja.png';
import jemma from '@/assets/jemma.png';
import titi from '@/assets/titi.png';
import trash from '@/assets/trash.jpg';
import lawn from '@/assets/lawn.png';

const familyMembers = [
  { name: 'Dipankar Bandyopadhyay', role: 'Senior Executive Vice President, Reliance Industries Ltd', image: jeja },
  { name: 'Nandita Bandyopadhyay', role: 'Former Teacher', image: jemma },
  { name: 'Ahana Bandyopadhyay', role: 'Plastic Surgeon', image: titi },
  { name: 'Subhankar Bandyopadhyay', role: 'Dental Surgeon & Director, Glitter Dental Clinic', image: baba },
  { name: 'Deepa Banerjee', role: 'Writer and Former Teacher', image: ma },
  { name: 'Bihan Banerjee', role: 'Computer Science and Engineering Student', image: me },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium tracking-wider uppercase text-sm">
              Our Story
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2">
              About Serenity Gardens
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              What began as parents' wish to see a combined venture between the brothers, 'Serenity Gardens' has become a reflection of the close familial ties and much more. Nestling amongst the Tematha farm lands, it speaks volumes about supporting a biosustainable economy in form of pisciculture, organic farm produce and green house resources.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              The project of 'Serenity Gardens' commenced and still continues in the hands of the locals and provides an inspiration to give back to the community in form of free medical and teaching services. This sanctum is a quest to serve Mother Nature while respecting family values and preserving our roots in its every spectrum.
            </p>
          </motion.div>

          {/* Compare Slider with Labels */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              Our Transformation Journey
            </h2>
            <div className="relative flex items-center justify-center">
              <Compare
                firstImage={broken}
                secondImage={bigGarden}
                className="w-full h-[300px] md:h-[500px] lg:h-[600px] rounded-2xl"
                firstImageClassName="object-cover"
                secondImageClassname="object-cover"
                slideMode="drag"
                autoplay={true}
                autoplayDuration={3000}
              />
              {/* Labels */}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-semibold text-sm md:text-base pointer-events-none z-50">
                2021 - Before
              </div>
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-semibold text-sm md:text-base pointer-events-none z-50">
                2025 - After
              </div>
            </div>
            <p className="text-center text-muted-foreground mt-6 text-sm md:text-base">
              The transformation of the main house over time.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <div className="relative flex items-center justify-center">
              <Compare
                firstImage={trash}
                secondImage={lawn}
                className="w-full h-[300px] md:h-[500px] lg:h-[600px] rounded-2xl"
                firstImageClassName="object-cover"
                secondImageClassname="object-cover"
                slideMode="drag"
                autoplay={true}
                autoplayDuration={3000}
              />
              {/* Labels */}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-semibold text-sm md:text-base pointer-events-none z-50">
                2021 - Before
              </div>
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-semibold text-sm md:text-base pointer-events-none z-50">
                2025 - After
              </div>
            </div>
            <p className="text-center text-muted-foreground mt-6 text-sm md:text-base">
              The lawn getting made over the years.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Family Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium tracking-wider uppercase text-sm">
              Our Team
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
              Meet the Family
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              The passionate people behind Serenity Gardens who make the magic happen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {familyMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-background rounded-2xl overflow-hidden border border-border shadow-lg"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm mt-1">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium tracking-wider uppercase text-sm">
              What We Believe
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
              Our Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { title: 'Sustainability', desc: 'We prioritize eco-friendly practices in everything we do.' },
              { title: 'Community', desc: 'Building connections through shared love of nature.' },
              { title: 'Education', desc: 'Teaching the next generation about plant care and conservation.' },
              { title: 'Beauty', desc: 'Creating spaces that inspire awe and tranquility.' },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
