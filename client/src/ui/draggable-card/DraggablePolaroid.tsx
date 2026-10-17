import { motion, useMotionValue, useTransform, useSpring, PanInfo } from 'framer-motion';
import { useState } from 'react';

interface PolaroidCardProps {
  image: string;
  title: string;
  description?: string;
  rotation?: number;
  index: number;
}

export const DraggablePolaroid = ({ image, title, description, rotation = 0, index }: PolaroidCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const springConfig = { stiffness: 300, damping: 30 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleDragEnd = (_: any, info: PanInfo) => {
    x.set(0);
    y.set(0);
    setIsDragging(false);
  };

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        rotateX,
        rotateY,
        zIndex: isDragging ? 50 : index,
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: rotation }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      whileHover={{ scale: 1.05, zIndex: 40 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      className="absolute cursor-grab active:cursor-grabbing"
    >
      <div className="w-48 md:w-64 bg-background p-3 rounded-lg shadow-2xl">
        <div className="aspect-square overflow-hidden rounded">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
        <div className="mt-3 text-center">
          <h4 className="font-serif font-semibold text-foreground">{title}</h4>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface PolaroidStackProps {
  cards: Array<{
    image: string;
    title: string;
    description?: string;
  }>;
}

export const PolaroidStack = ({ cards }: PolaroidStackProps) => {
  const rotations = [-12, 5, -5, 10, -8, 3];
  
  return (
    <div className="relative h-96 md:h-[500px] flex items-center justify-center">
      {cards.map((card, index) => (
        <DraggablePolaroid
          key={index}
          {...card}
          index={index}
          rotation={rotations[index % rotations.length]}
        />
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <p className="text-muted-foreground text-sm">...and many more</p>
      </div>
    </div>
  );
};
