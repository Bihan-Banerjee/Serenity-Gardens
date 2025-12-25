import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <Leaf className="w-12 h-12 text-primary" />
      </motion.div>
    </div>
  );
};

export const SectionLoader = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <Leaf className="w-8 h-8 text-primary" />
      </motion.div>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 animate-pulse">
      <div className="aspect-square bg-muted rounded-lg mb-4" />
      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
      <div className="h-3 bg-muted rounded w-1/2" />
    </div>
  );
};
