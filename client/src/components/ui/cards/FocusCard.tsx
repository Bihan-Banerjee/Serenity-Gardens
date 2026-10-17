import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface FocusCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  image?: string;
  index: number;
}

export const FocusCard = ({ title, description, icon: Icon, href, image, index }: FocusCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link to={href}>
        <motion.div
          whileHover={{ y: -10, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative group h-64 md:h-80 rounded-2xl overflow-hidden cursor-pointer"
        >
          {/* Background Image */}
          {image && (
            <div className="absolute inset-0">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-transparent" />
            </div>
          )}
          
          {/* Fallback gradient background */}
          {!image && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent to-primary/10" />
          )}

          {/* Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="p-2 rounded-lg bg-primary/20 backdrop-blur-sm">
                <Icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-background">
                {title}
              </h3>
            </motion.div>
            <p className="text-background/80 text-sm md:text-base line-clamp-2">
              {description}
            </p>

            {/* Hover Overlay */}
            <motion.div
              className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          {/* Decorative border */}
          <div className="absolute inset-0 rounded-2xl border border-background/20 group-hover:border-primary/50 transition-colors duration-300" />
        </motion.div>
      </Link>
    </motion.div>
  );
};
