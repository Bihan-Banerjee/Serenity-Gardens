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
  { 
    name: "Moupriya Das", 
    review: "Excellent place to spend quality time with friends and family... Great space for picnic... Organic veggies to fishing ...clean ac room... Amazing food... We had a great time....", 
    rating: 5 
  },
  { 
    name: "Rana Paul", 
    review: "Nice place", 
    rating: 5 
  },
  { 
    name: "Amarnath Mahalanobish", 
    review: "Nice place, clean rooms, homely but tasty food. Good place for family/friends hangout.", 
    rating: 4 
  },
  { 
    name: "Kamal Chattopadhyay", 
    review: "We Active Seniors of our closely held club of Greenwood had a wonderful time y'tday out at Deepa-Shubhankar's calm cool sunny Serenity Gardens. Amidst greens & colorful environ we enjoyed thoroughly, with snacks, wholesome lunch & endless adda that put the 'spirits'high! A few snaps of the day..", 
    rating: 5 
  },
  { 
    name: "Arup Chakraborty", 
    review: "This place is amazing...quite and calm, and overall the hospitality is quite appreciable", 
    rating: 5 
  },
  { 
    name: "Xpert Dental Clinic", 
    review: "Very nice garden and feels like close to nature ..keep it subhankar sir ....very nice and beautiful farm house", 
    rating: 5 
  },
  { 
    name: "Soma Dasgupta", 
    review: "Very nice place & very large area. I would highly recommend it for a family picnic . Enjoyed a lot with my buddies.", 
    rating: 5 
  },
  { 
    name: "Tamali Ghosh", 
    review: "I wanted to take a moment to express my heartfelt gratitude for hosting us at your beautiful farmhouse. The entire experience was absolutely wonderful and truly unforgettable! From the moment we arrived, we were captivated by the picturesque surroundings. The serene landscape, lush greenery, and charming farmhouse created the perfect setting for a relaxing day out. It felt like a hidden gem tucked away from the hustle and bustle of everyday life. The food was simply delightful! Every dish was prepared with such care and love, and it showed. The flavors were exceptional, and we couldn't stop raving about the delicious spread you provided. It was clear that a lot of thought and effort went into making sure we had the best dining experience possible. Your farmhouse is truly a haven of peace and beauty. Whether it was lounging by the garden, exploring the scenic trails, or simply enjoying each other's company in such a welcoming space, every moment was a joy. It’s the perfect place for a day out with family and friends. Thank you once again for your incredible hospitality. Your farmhouse is a treasure, and I can't wait to share our wonderful experience with others. I highly recommend it to anyone looking for a memorable and relaxing getaway.", 
    rating: 5 
  },
  { 
    name: "Munmun Basu", 
    review: "Excellent food,superb hospitality, beauty and peace of nature prevail everywhere in this place", 
    rating: 5 
  },
  { 
    name: "Dola Ray", 
    review: "A fantastic experience at Serenity Gardens. Exceptional arrangements and tasty food, surrounded by pristine greens. A walk down the gardens and pond was pure joy. An island of peace and serenity indeed.", 
    rating: 5 
  },
  { 
    name: "Arun Thakur", 
    review: "Very good place...", 
    rating: 5 
  },
  { 
    name: "Soumen Chakraborty", 
    review: "Honestly, this place is a hidden gem! Perfectly planned and decorated, it's the ultimate chill spot just outside Kolkata 😊. Unmatched hospitality is there strength...", 
    rating: 5 
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
      fetchReviews(); 
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

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
