import { motion } from 'framer-motion';
import { Layout } from '@/components/layout';
import { ImageCarousel } from '@/components/ui/carousel/ImageCarousel';
import heroImage from '@/assets/hero-garden.jpg';
import wall from '@/assets/wall.png';
import harvest from '@/assets/harvest.png';
import bench from '@/assets/bench.jpg';
import rose from '@/assets/rose.png';
import aerial from '@/assets/aerial.png';
import closeup from '@/assets/closeup.jpg';
import pond from '@/assets/pond.jpg';
import corridor from '@/assets/corridor.jpg';
import chhad from '@/assets/chhad.jpg';
import gazebo from '@/assets/gazebo.jpg';
import lane from '@/assets/lane.jpg';
import stairs from '@/assets/stairs.jpg';
import swing from '@/assets/swing.jpg';
import ghat from '@/assets/ghat.jpg';
import view from '@/assets/view.jpg';
import tile from '@/assets/tile.jpg';
import pond2 from '@/assets/pond2.jpg';
import bigcrop from '@/assets/bigcrop.png';
import bigflower from '@/assets/bigflower.png';
import lilypad from '@/assets/lilypad.png';
import lawn from '@/assets/lawn.png';
import cabbage from '@/assets/cabbage.png';
import corner from '@/assets/corner.png';

const galleryImages = [
  { src: heroImage, alt: 'Serenity Gardens Main View' },
  { src: wall, alt: 'Beautiful Garden Path' },
  { src: harvest, alt: 'Peaceful Gazebo Retreat' },
  { src: bench, alt: 'Ornamental Garden Fountain' },
  { src: rose, alt: 'Beautiful Garden Path' },
  { src: aerial, alt: 'Peaceful Gazebo Retreat' },
  { src: closeup, alt: 'Ornamental Garden Fountain' },
  { src: pond, alt: 'Beautiful Garden Path' },
  { src: corridor, alt: 'Peaceful Gazebo Retreat' },
  { src: chhad, alt: 'Ornamental Garden Fountain' },
  { src: stairs, alt: 'Beautiful Garden Path' },
  { src: gazebo, alt: 'Peaceful Gazebo Retreat' },
  { src: lane, alt: 'Ornamental Garden Fountain' },
  { src: ghat, alt: 'Beautiful Garden Path' },
  { src: swing, alt: 'Peaceful Gazebo Retreat' },
  { src: view, alt: 'Ornamental Garden Fountain' },
  { src: tile, alt: 'Beautiful Garden Path' },
  { src: pond2, alt: 'Peaceful Gazebo Retreat' },
  { src: bigcrop, alt: 'Ornamental Garden Fountain' },
  { src: bigflower, alt: 'Beautiful Garden Path' },
  { src: lilypad, alt: 'Peaceful Gazebo Retreat' },
  { src: lawn, alt: 'Ornamental Garden Fountain' },
  { src: cabbage, alt: 'Beautiful Garden Path' },
  { src: corner, alt: 'Peaceful Gazebo Retreat' },
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
