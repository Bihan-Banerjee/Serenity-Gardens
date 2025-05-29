import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { AuroraText } from "@/components/magicui/aurora-text";
const ExplorePage = () => {
  const testimonials = [
    {
      quote: "Serenity Gardens is the perfect getaway spot for family picnics. Surrounded by nature, you’ll feel rejuvenated and relaxed!",
      name: "Family Picnic",
      designation: "Nature Retreat",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/ibdeyxi3jveyr3haywum.jpg",
    },
    {
      quote: "Host your next birthday or anniversary party here! Beautiful spaces, great lighting, and plenty of greenery for photos.",
      name: "Party Venue",
      designation: "Celebrations & Events",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/qzb7kxjiaubde9wy3ebb.jpg",
    },
    {
      quote: "Looking for a peaceful photoshoot location? Our floral gardens and rustic benches offer the perfect backdrop.",
      name: "Photography",
      designation: "Perfect Backdrops",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/pg04ahdxekzcrtajcuwz.jpg",
    },
    {
      quote: "Escape the city buzz and enjoy an evening under the stars at Serenity Gardens. Unwind, relax, and make memories.",
      name: "Evening Escape",
      designation: "Under the Stars",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/hr8dz5acvwvdpa427txt.jpg",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center mt-22 px-4">
      <div className="w-full px-1 md:px-8 flex items-center justify-center">
          <AuroraText className="text-4xl md:text-6xl mb-10 font-bold flex items-center justify-center text-center">
            Explore
          </AuroraText>
      </div>
      <p className="text-center text-white max-w-2xl mb-10">
        Discover the charm and versatility of our garden house — perfect for rentals, parties, photo sessions, and peaceful retreats.
      </p>

      <AnimatedTestimonials testimonials={testimonials} autoplay />
    </div>
  );
};

export default ExplorePage;
