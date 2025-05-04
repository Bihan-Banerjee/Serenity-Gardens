import { FocusCards } from "@/components/ui/focus-cards";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto mt-40 px-6">
      <div className="max-w-2xl mx-auto mb-12">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">About Us</h2>
        <p className="text-white text-lg">
          What began as parents’ wish to see a combined venture between the brothers, ‘Serenity Gardens’ has become a reflection of the close familial ties and much more. Nestling amongst the Tematha farm lands, it speaks volumes about supporting a biosustainable economy in form of pisciculture, organic farm produce, and greenhouse resources. The project of ‘Serenity Gardens’ commenced and still continues in the hands of the locals and provides an inspiration to give back to the community in form of free medical and teaching services. This sanctum is a quest to serve Mother Nature while respecting family values and preserving our roots in its every spectrum.
        </p>
      </div>

      <div className="w-5xl mx-auto mb-20 mt-30 px-4">
      <FocusCards
          cards={[
            { title: "Baba", src: "/images/wall.jpg" },
            { title: "Ma", src: "/images/corner.jpg" },
            { title: "Gablu", src: "/images/garden.jpg" },
            { title: "Jeja", src: "/images/sky.jpg" },
            { title: "Jemma", src: "/images/harvest.jpg" },
            { title: "Titi Didi", src: "/images/bird.jpg" },
          ]}
        />
      </div>
    </div>
  );
};

export default About;
