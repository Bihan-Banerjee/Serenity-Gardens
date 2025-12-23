import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Camera, Star, Calendar, ShoppingBag, Compass } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { FocusCard } from '@/components/ui/cards/FocusCard';
import heroImage from '@/assets/hero-garden.jpg';
import gardenPath from '@/assets/garden-path.jpg';
import gardenGazebo from '@/assets/garden-gazebo.jpg';
import gardenFountain from '@/assets/garden-fountain.jpg';

const focusCards = [
  {
    title: 'About Us',
    description: 'Discover the story behind Serenity Gardens and our passion for nature.',
    icon: Leaf,
    href: '/about',
    image: gardenPath,
  },
  {
    title: 'Gallery',
    description: 'Explore stunning visuals of our beautiful garden landscapes.',
    icon: Camera,
    href: '/gallery',
    image: gardenGazebo,
  },
  {
    title: 'Explore',
    description: 'Take a virtual tour through our enchanting garden features.',
    icon: Compass,
    href: '/explore',
    image: gardenFountain,
  },
  {
    title: 'Reviews',
    description: 'See what our visitors have to say about their experience.',
    icon: Star,
    href: '/reviews',
    image: gardenPath,
  },
  {
    title: 'Upcoming Plans',
    description: 'Exciting new additions coming soon to the gardens.',
    icon: Calendar,
    href: '/upcoming',
    image: gardenGazebo,
  },
  {
    title: 'Shop',
    description: 'Browse our collection of plants, seeds, and garden accessories.',
    icon: ShoppingBag,
    href: '/shop',
    image: gardenFountain,
  },
];

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={heroImage}
            alt="Serenity Gardens"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-background" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <Leaf className="w-6 h-6 text-primary" />
            <span className="text-primary font-medium tracking-wider uppercase text-sm">
              Welcome to Paradise
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-background mb-6 leading-tight"
          >
            Serenity <span className="text-primary">Gardens</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-background/90 max-w-2xl mx-auto mb-8"
          >
            Experience the tranquility of nature in our meticulously crafted 
            garden sanctuary. A perfect escape from the everyday hustle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="gap-2">
              <Link to="/explore">
                Explore Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-background/10 border-background/30 text-background hover:bg-background/20">
              <Link to="/shop">Visit Shop</Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-background/50 flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-background/80" />
          </motion.div>
        </motion.div>
      </section>

      {/* Focus Cards Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium tracking-wider uppercase text-sm">
              Discover
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
              Explore Our Garden
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Navigate through our beautiful garden sections and discover what makes us special.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {focusCards.map((card, index) => (
              <FocusCard key={card.title} {...card} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium tracking-wider uppercase text-sm">
              Why Choose Us
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
              The Serenity Experience
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Natural Beauty',
                description: 'Immerse yourself in carefully curated landscapes featuring exotic plants and serene water features.',
              },
              {
                title: 'Expert Care',
                description: 'Our team of horticulturists ensures every corner of the garden is maintained to perfection.',
              },
              {
                title: 'Peaceful Retreat',
                description: 'Find your inner peace in our meditation gardens and quiet reflection spaces.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-xl bg-background border border-border"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent to-primary/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Experience Serenity?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Visit our shop to bring a piece of our garden into your home, 
              or plan your visit to experience the magic in person.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/menu">Browse Plants</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/reviews">Read Reviews</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
