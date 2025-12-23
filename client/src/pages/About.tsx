import { motion } from 'framer-motion';
import { Layout } from '@/components/layout';
import { CompareSlider } from '@/components/ui/compare/CompareSlider';
import gardenPath from '@/assets/garden-path.jpg';
import gardenGazebo from '@/assets/garden-gazebo.jpg';
import gardenFountain from '@/assets/garden-fountain.jpg';
import heroImage from '@/assets/hero-garden.jpg';

const familyMembers = [
  { name: 'Robert Green', role: 'Founder & Head Gardener', image: gardenPath },
  { name: 'Sarah Green', role: 'Co-Founder & Botanist', image: gardenGazebo },
  { name: 'Michael Green', role: 'Landscape Architect', image: gardenFountain },
  { name: 'Emma Green', role: 'Operations Manager', image: gardenPath },
  { name: 'David Green', role: 'Horticulture Expert', image: gardenGazebo },
  { name: 'Lisa Green', role: 'Customer Relations', image: gardenFountain },
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
              Founded in 2010, Serenity Gardens began as a small family project born from a deep 
              love for nature and a dream to create a peaceful sanctuary where people could 
              reconnect with the natural world. What started as a modest backyard garden has 
              blossomed into one of the region's most beloved botanical destinations.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              Our mission is simple: to inspire a love for nature while providing a tranquil 
              escape from the hustle of everyday life. Every plant, pathway, and water feature 
              is carefully curated to create an atmosphere of peace and wonder.
            </p>
          </motion.div>

          {/* Compare Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <h2 className="font-serif text-2xl font-bold text-foreground text-center mb-6">
              Our Transformation
            </h2>
            <CompareSlider
              beforeImage={gardenPath}
              afterImage={heroImage}
              beforeLabel="2010"
              afterLabel="Today"
            />
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
