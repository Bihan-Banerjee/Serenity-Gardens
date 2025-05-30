import { AuroraBackground } from "@/components/ui/aurora-background";
import { AuroraText } from "@/components/magicui/aurora-text";
import { FocusCards } from "@/components/ui/focus-cards";
import MainLoader from "@/components/loaders/MainLoader";
import { useEffect, useState } from "react";
const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const isHardLoad = navEntry?.type === "reload" || navEntry?.type === "navigate";

    if (isHardLoad) {
      const timer = setTimeout(() => setLoading(false), 3500);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
        <MainLoader />
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden w-full">
      <AuroraBackground className="pt-36 pb-20 px-4 overflow-x-hidden w-full">
        <div className="flex flex-col items-center text-center space-y-4 mb-16 overflow-x-hidden w-full">
          <h2 className="text-2xl md:text-4xl font-semibold mt-4">
            Welcome to
          </h2>
          <AuroraText className="text-4xl md:text-6xl mb-7.5 font-bold">
            Serenity Gardens
          </AuroraText>
          <p className="mt-2 text-lg max-w-2xl text-center">
            Discover the beauty of nature and tranquility in our serene gardens.
            Explore, relax, and rejuvenate your senses in a peaceful environment.
          </p>
        </div>
        <section className="w-full max-w-7xl mx-auto overflow-x-hidden w-full">
          <FocusCards
            redirectOnClick={true}
            cards={[
              { title: "About Us", src: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747575957/serenity/images/jjvvthkzp2ychq8n5bhl.jpg", link: "/about" },
              { title: "Gallery", src: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747575957/serenity/images/ibdeyxi3jveyr3haywum.jpg", link: "/gallery" },
              { title: "Reviews", src: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747575957/serenity/images/zww1tqnxhcxqj3kvipbc.jpg", link: "/reviews" },
              { title: "Upcoming Plans", src: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747575957/serenity/images/nxg3svvd6hqg4jxcounn.jpg", link: "/upcoming-plans" },
              { title: "Explore", src: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747575957/serenity/images/ve16mdjatbtj5ml1elrs.jpg", link: "/explore" },
              { title: "Shop", src: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747575957/serenity/images/snuootxbedmhpy09lzie.jpg", link: "/menu"},
            ]}
          />
        </section>
      </AuroraBackground>
    </div>
  );
};

export default Home;
