import { motion } from 'framer-motion';
import { Flower2, TreePine, Bird, Droplets, Sunrise, Mountain } from 'lucide-react';
import { Layout } from '@/components/layout';
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials/AnimatedTestimonials';
import heroImage from '@/assets/hero-garden.jpg';
import gardenPath from '@/assets/garden-path.jpg';
import gardenGazebo from '@/assets/garden-gazebo.jpg';
import gardenFountain from '@/assets/garden-fountain.jpg';

const features = [
  {
    title: 'Rose Garden',
    description: 'Over 500 varieties of roses from around the world, blooming in a spectacular display of colors.',
    icon: Flower2,
    image: gardenPath,
  },
  {
    title: 'Pine Forest Trail',
    description: 'A serene walking path through ancient pine trees, perfect for meditation and reflection.',
    icon: TreePine,
    image: gardenGazebo,
  },
  {
    title: 'Bird Sanctuary',
    description: 'Home to over 100 species of birds, with observation decks and feeding stations.',
    icon: Bird,
    image: heroImage,
  },
  {
    title: 'Koi Ponds',
    description: 'Beautiful Japanese-style koi ponds with bridges and peaceful sitting areas.',
    icon: Droplets,
    image: gardenFountain,
  },
  {
    title: 'Sunrise Pavilion',
    description: 'The perfect spot to witness breathtaking sunrises over the garden landscape.',
    icon: Sunrise,
    image: gardenPath,
  },
  {
    title: 'Rock Garden',
    description: 'A stunning arrangement of natural rocks and alpine plants from mountainous regions.',
    icon: Mountain,
    image: gardenGazebo,
  },
];

const testimonials = [
  {
    name: 'Emily Thompson',
    role: 'Nature Enthusiast',
    content: 'Serenity Gardens is truly a slice of paradise. Every visit feels like a meditation retreat. The attention to detail in every corner is remarkable.',
  },
  {
    name: 'James Wilson',
    role: 'Photographer',
    content: 'As a landscape photographer, I\'ve visited many gardens, but Serenity Gardens stands out. The variety of flora and the thoughtful design make it a photographer\'s dream.',
  },
  {
    name: 'Priya Sharma',
    role: 'Yoga Instructor',
    content: 'I bring my yoga classes here every weekend. The peaceful atmosphere and fresh air create the perfect environment for mindfulness practice.',
  },
];

const Explore = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium tracking-wider uppercase text-sm">
              Virtual Tour
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2">
              Explore Our Garden
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Discover the unique features and attractions that make Serenity Gardens a true sanctuary.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-serif text-xl font-semibold text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium tracking-wider uppercase text-sm">
              Testimonials
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
              What Visitors Say
            </h2>
          </motion.div>

          <AnimatedTestimonials testimonials={testimonials} />
        </div>
      </section>
    </Layout>
  );
};

export default Explore;
