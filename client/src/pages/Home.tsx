import { AuroraBackground } from "@/components/ui/aurora-background";
import { AuroraText } from "@/components/magicui/aurora-text";
import { FocusCards } from "@/components/ui/focus-cards";

const Home = () => {
  return (
    <AuroraBackground className="pt-36 pb-20 px-4">
      <div className="flex flex-col items-center text-center space-y-4 mb-16">
        <AuroraText className="text-4xl md:text-6xl font-bold">
          Serenity Gardens
        </AuroraText>
        <h2 className="text-2xl md:text-4xl font-semibold mt-4">
          Welcome to Serenity Gardens
        </h2>
        <p className="mt-2 text-lg max-w-2xl text-center">
          Discover the beauty of nature and tranquility in our serene gardens.
          Explore, relax, and rejuvenate your senses in a peaceful environment.
        </p>
      </div>
      <section className="w-full max-w-7xl mx-auto">
        <FocusCards
          cards={[
            { title: "Explore", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/jjvvthkzp2ychq8n5bhl.jpg" },
            { title: "Gallery", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/ibdeyxi3jveyr3haywum.jpg" },
            { title: "Reviews", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/zww1tqnxhcxqj3kvipbc.jpg" },
            { title: "Explore", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/nxg3svvd6hqg4jxcounn.jpg" },
            { title: "Gallery", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/ve16mdjatbtj5ml1elrs.jpg" },
            { title: "Reviews", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/snuootxbedmhpy09lzie.jpg" },
          ]}
        />
      </section>
    </AuroraBackground>
  );
};

export default Home;
