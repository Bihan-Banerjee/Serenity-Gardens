import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  name: string;
  role?: string;
  content: string;
  avatar?: string;
}

interface AnimatedTestimonialsProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
}

export const AnimatedTestimonials = ({ 
  testimonials, 
  autoPlay = true, 
  interval = 6000 
}: AnimatedTestimonialsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval]);

  const testimonial = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center"
        >
          <Quote className="w-12 h-12 text-primary/30 mx-auto mb-6" />
          
          <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
            "{testimonial.content}"
          </p>

          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              {testimonial.avatar ? (
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-primary">
                  {testimonial.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
              {testimonial.role && (
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button variant="outline" size="icon" onClick={prev} className="rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary w-6'
                  : 'bg-muted hover:bg-muted-foreground'
              }`}
            />
          ))}
        </div>

        <Button variant="outline" size="icon" onClick={next} className="rounded-full">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
