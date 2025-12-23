import { motion } from 'framer-motion';
import { Layout } from '@/components/layout';
import { PolaroidStack } from '@/components/ui/draggable-card/DraggablePolaroid';
import gardenPath from '@/assets/garden-path.jpg';
import gardenGazebo from '@/assets/garden-gazebo.jpg';
import gardenFountain from '@/assets/garden-fountain.jpg';
import heroImage from '@/assets/hero-garden.jpg';

const upcomingPlans = [
  { image: heroImage, title: 'Butterfly Garden', description: 'Coming Spring 2025' },
  { image: gardenPath, title: 'Night Bloom Walk', description: 'Summer 2025' },
  { image: gardenGazebo, title: 'Tea House', description: 'Fall 2025' },
  { image: gardenFountain, title: 'Waterfall Trail', description: 'Winter 2025' },
  { image: heroImage, title: 'Orchid Pavilion', description: 'Spring 2026' },
];

const UpcomingPlans = () => {
  return (
    <Layout>
      <section className="py-20 px-4 min-h-[80vh]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium tracking-wider uppercase text-sm">
              Coming Soon
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2">
              Upcoming Plans
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Exciting new additions coming to Serenity Gardens. Drag the cards to explore!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <PolaroidStack cards={upcomingPlans} />
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 max-w-3xl mx-auto"
          >
            <h2 className="font-serif text-2xl font-bold text-foreground text-center mb-12">
              Development Timeline
            </h2>
            
            <div className="space-y-8">
              {upcomingPlans.map((plan, index) => (
                <motion.div
                  key={plan.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-24 text-right text-sm text-primary font-medium">
                    {plan.description}
                  </div>
                  <div className="w-4 h-4 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1 bg-card border border-border rounded-lg p-4">
                    <h3 className="font-semibold text-foreground">{plan.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default UpcomingPlans;
