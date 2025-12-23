import { motion } from 'framer-motion';
import { Layout } from '@/components/layout';
import { ImageCarousel } from '@/components/ui/carousel/ImageCarousel';
import heroImage from '@/assets/hero-garden.jpg';
import gardenPath from '@/assets/garden-path.jpg';
import gardenGazebo from '@/assets/garden-gazebo.jpg';
import gardenFountain from '@/assets/garden-fountain.jpg';

const galleryImages = [
  { src: heroImage, alt: 'Serenity Gardens Main View' },
  { src: gardenPath, alt: 'Beautiful Garden Path' },
  { src: gardenGazebo, alt: 'Peaceful Gazebo Retreat' },
  { src: gardenFountain, alt: 'Ornamental Garden Fountain' },
];

const Gallery = () => {
  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium tracking-wider uppercase text-sm">
              Visual Journey
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2">
              Our Gallery
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Explore the beauty of Serenity Gardens through our curated collection of photographs.
            </p>
          </motion.div>

          {/* Main Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <ImageCarousel images={galleryImages} />
          </motion.div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="aspect-square rounded-2xl overflow-hidden border border-border shadow-lg"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;
