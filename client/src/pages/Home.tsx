import { AuroraBackground } from "@/components/ui/aurora-background";
import { AuroraText } from "@/components/magicui/aurora-text";
import { FocusCards } from "@/components/ui/focus-cards";

const Home = () => {
  return (
    <AuroraBackground className="pt-36 pb-20 px-4">
      {/* Title below Navbar */}
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

      {/* Cards section */}
      <section className="w-full max-w-7xl mx-auto">
        <FocusCards
          cards={[
            { title: "Explore", src: "wall.jpg" },
            { title: "Gallery", src: "corner.jpg" },
            { title: "Reviews", src: "garden.jpg" },
            { title: "Explore", src: "sky.jpg" },
            { title: "Gallery", src: "harvest.jpg" },
            { title: "Reviews", src: "bird.jpg" },
          ]}
        />
      </section>
    </AuroraBackground>
  );
};

export default Home;
