import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Marquee } from '@/components/magicui/marquee';
import api from '@/lib/axiosConfig';
import toast from 'react-hot-toast';

interface Review {
  _id: string;
  name: string;
  review: string;
  rating: number;
  createdAt: string;
}

const hardcodedTestimonials: Array<{ name: string; review: string; rating: number }> = [
  {
    name: "Suvankar Chakraborty",
    review: "We visited this Serenity gardens for our get together with old friends. The ambience is too good. The hospitality by the caretaker was amazing and food served was tasty and hygienic.",
    rating: 5,
  },
  {
    name: "Soma Gupta",
    review: "Excellent farm house with lot of places for children to play, colorful snaps and adda. Food and hospitality served needs special mention... really too tasty.",
    rating: 5,
  },
  {
    name: "Parna Banerjee",
    review: "My recent visit at Serenity Gardens was delightful. Nestled in serene green environment, perfect escape from daily life. Blend of modern amenities with tranquil nature.",
    rating: 5,
  },
  {
    name: "Kankani Mukherjee",
    review: "Mesmerising atmosphere, eye soothing greenery with fruits, vegetables and flower plants. Ideal place for get together with all amenities. Must visit!",
    rating: 5,
  },
  {
    name: "Sutreyi",
    review: "It is B-E-A-U-T-I-F-U-L...💚",
    rating: 5,
  },
  {
    name: "Madhumita Chatterjee",
    review: "Serenity Garden - huge tranquil plot beautified with flowers, fruits, vegetables and decorative planters. Worth spending a whole day for relaxation.",
    rating: 5,
  },
  {
    name: "SRABANI CHAKRABORTY",
    review: "The scenic beauty of this place is amazing, every part full of greenery.",
    rating: 5,
  },
  {
    name: "Paramita Roy",
    review: "Aesthetically decorated, neat and well maintained Farm House. Food was amazing. Worth a visit.",
    rating: 5,
  },
];

// ReviewCard component
const ReviewCard = ({ name, review, rating }: { name: string; review: string; rating: number }) => (
  <div className="flex flex-col items-center justify-center bg-card/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl min-w-[280px] max-w-sm text-center border border-border/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    {/* Rating Stars */}
    <div className="flex mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 transition-all ${
            i < rating ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg' : 'text-muted-foreground/70'
          }`}
        />
      ))}
    </div>
    
    {/* Name */}
    <h3 className="font-serif font-semibold text-xl text-foreground mb-3 tracking-tight">
      {name}
    </h3>
    
    {/* Review */}
    <p className="text-muted-foreground leading-relaxed text-sm line-clamp-5">
      "{review}"
    </p>
  </div>
);

const Reviews = () => {
  const [dbReviews, setDbReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    review: '',
    rating: 5,
  });

  // Fetch DB reviews
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews/all');
      setDbReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/reviews/submit', formData);
      toast.success('Thank you for your review! 🌟');
      setFormData({ name: '', review: '', rating: 5 });
      fetchReviews(); // Refresh DB reviews
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Split logic for 3 rows
  const chunkSize = Math.ceil(hardcodedTestimonials.length / 3);
  const firstRow = hardcodedTestimonials.slice(0, chunkSize);
  const secondRow = hardcodedTestimonials.slice(chunkSize, chunkSize * 2);
  const thirdRow = hardcodedTestimonials.slice(chunkSize * 2);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-4 md:py-12">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-medium tracking-wider uppercase text-sm mb-4 inline-block">
              Reviews
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              What Our Visitors Say
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-2">
              Discover why guests love Serenity Gardens through their heartfelt experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3-Row Marquee Section - MINIMAL TOP PADDING */}
      <section className="py-4 md:py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="space-y-8 md:space-y-12">
            {/* Row 1 - Left to Right */}
            <Marquee 
              className="overflow-visible [--gap:2rem] [--duration:40s] gap-8 md:gap-12"
              pauseOnHover
            >
              {firstRow.map((testimonial, idx) => (
                <ReviewCard
                  key={`row1-${idx}`}
                  name={testimonial.name}
                  review={testimonial.review}
                  rating={testimonial.rating}
                />
              ))}
            </Marquee>

            {/* Row 2 - Right to Left (Reverse) */}
            <Marquee 
              reverse
              className="overflow-visible [--gap:2rem] [--duration:45s] gap-8 md:gap-12"
              pauseOnHover
            >
              {secondRow.map((testimonial, idx) => (
                <ReviewCard
                  key={`row2-${idx}`}
                  name={testimonial.name}
                  review={testimonial.review}
                  rating={testimonial.rating}
                />
              ))}
            </Marquee>

            {/* Row 3 - Left to Right */}
            <Marquee 
              className="overflow-visible [--gap:2rem] [--duration:35s] gap-8 md:gap-12"
              pauseOnHover
            >
              {thirdRow.map((testimonial, idx) => (
                <ReviewCard
                  key={`row3-${idx}`}
                  name={testimonial.name}
                  review={testimonial.review}
                  rating={testimonial.rating}
                />
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* Recent DB Reviews Count */}
      {dbReviews.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            + {dbReviews.length} more recent reviews from our guests
          </p>
        </div>
      )}

      {/* Review Form Section - OLDER VERSION STYLE */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                Share Your Experience
              </h2>
              <p className="text-muted-foreground mt-2">
                We'd love to hear about your visit
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-background border border-border rounded-2xl p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= formData.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-muted'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review">Your Review</Label>
                <Textarea
                  id="review"
                  placeholder="Tell us about your experience..."
                  rows={4}
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Reviews;
