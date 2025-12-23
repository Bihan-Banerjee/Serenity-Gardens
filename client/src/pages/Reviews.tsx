import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Marquee, ReviewCard } from '@/components/ui/marquee/Marquee';
import api from '@/lib/axiosConfig';
import toast from 'react-hot-toast';

interface Review {
  _id: string;
  name: string;
  review: string;
  rating: number;
  createdAt: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    review: '',
    rating: 5,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews/all');
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/reviews/submit', formData);
      toast.success('Thank you for your review!');
      setFormData({ name: '', review: '', rating: 5 });
      fetchReviews();
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const halfLength = Math.ceil(reviews.length / 2);
  const firstHalf = reviews.slice(0, halfLength);
  const secondHalf = reviews.slice(halfLength);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-primary font-medium tracking-wider uppercase text-sm">
              Testimonials
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2">
              What People Say
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Read reviews from our visitors and share your own experience at Serenity Gardens.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Marquee Reviews */}
      {reviews.length > 0 && (
        <section className="py-8 overflow-hidden">
          <Marquee direction="left" speed={40} className="mb-4">
            {firstHalf.map((review) => (
              <ReviewCard
                key={review._id}
                name={review.name}
                review={review.review}
                rating={review.rating}
                date={review.createdAt}
              />
            ))}
          </Marquee>
          
          {secondHalf.length > 0 && (
            <Marquee direction="right" speed={35}>
              {secondHalf.map((review) => (
                <ReviewCard
                  key={review._id}
                  name={review.name}
                  review={review.review}
                  rating={review.rating}
                  date={review.createdAt}
                />
              ))}
            </Marquee>
          )}
        </section>
      )}

      {/* Review Form */}
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
