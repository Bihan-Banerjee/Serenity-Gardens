import { motion } from 'framer-motion';

interface ReviewCardProps {
  name: string;
  review: string;
  rating: number;
  date?: string;
  avatar?: string;
}

export const ReviewCard = ({ name, review, rating, date, avatar }: ReviewCardProps) => {
  return (
    <div className="w-80 flex-shrink-0 p-6 bg-card border border-border rounded-xl shadow-lg mx-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-primary">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-foreground">{name}</h4>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${i < rating ? 'text-yellow-500' : 'text-muted'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">{review}</p>
      {date && (
        <p className="text-muted text-xs mt-3">
          {new Date(date).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

interface MarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

export const Marquee = ({ children, direction = 'left', speed = 30, className = '' }: MarqueeProps) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};
