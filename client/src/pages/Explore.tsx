import { motion } from 'framer-motion';
import { Worm, TreePine, Bird, Droplet, Sunrise, Camera } from 'lucide-react';
import { Layout } from '@/components/layout';
import worm from '@/assets/worm.png';
import heroGarden from '@/assets/hero-garden.jpg';
import pond from '@/assets/pond.jpg';
import picnic from '@/assets/picnic.jpg';
import lawn from '@/assets/lawn.png';
import bird from '@/assets/bird1.jpg';
const features = [
  {
    title: 'Family Picnic',
    description: 'Serenity Gardens is the perfect getaway spot for family picnics. Surrounded by nature, you’ll feel rejuvenated and relaxed!',
    icon: Sunrise,
    image: picnic,
  },
  {
    title: 'Evening Escape',
    description: 'Escape the city buzz and enjoy an evening under the stars at Serenity Gardens. Unwind, relax, and make memories. ',
    icon: TreePine,
    image: lawn,
  },
  {
    title: 'Bird Haven',
    description: 'Home to over 30 species of birds, with regular sightings of colorful songbirds, cormorants and majestic kingfishers.',
    icon: Bird,
    image: bird,
  },
  {
    title: 'Pond of Life',
    description: 'A tranquil pond teeming with fish, crabs, etc. offering a serene spot for reflection and nature observation.',
    icon: Droplet,
    image: pond,
  },
  {
    title: 'Vermicompost Area',
    description: 'Vermicompost area where organic waste is broken down into nutrient rich compost by earthworms.',
    icon: Worm,
    image: worm,
  },
  {
    title: 'Photoshoot Spot',
    description: 'A picturesque gazebo, lawn, and pond surrounded by vibrant flowers, ideal for memorable photoshoots.',
    icon: Camera,
    image: heroGarden,
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
    </Layout>
  );
};

export default Explore;
