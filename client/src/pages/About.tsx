import { FocusCards } from "@/components/ui/focus-cards";
import { AuroraText } from "@/components/magicui/aurora-text";
import { Compare } from "@/components/ui/compare";
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
            { title: "Baba", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/jjvvthkzp2ychq8n5bhl.jpg" },
            { title: "Ma", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/jjvvthkzp2ychq8n5bhl.jpg" },
            { title: "Gablu", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/jjvvthkzp2ychq8n5bhl.jpg" },
            { title: "Jeja", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/jjvvthkzp2ychq8n5bhl.jpg" },
            { title: "Jemma", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/jjvvthkzp2ychq8n5bhl.jpg" },
            { title: "Titi Didi", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/jjvvthkzp2ychq8n5bhl.jpg" },
          ]}
        />
      </div>
      <AuroraText className="text-4xl md:text-6xl font-bold flex items-center justify-center text-center">
        Before VS After
      </AuroraText>
      <div className="w-full h-[90vh] px-1 md:px-8 flex items-center justify-center [perspective:800px] [transform-style:preserve-3d]">
      <div
        style={{
          transform: "rotateX(15deg) translateZ(80px)",
        }}
        className="p-1 md:p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100  border-neutral-200 dark:border-neutral-800 mx-auto w-3/4 h-1/2 md:h-3/4"
      >
        <Compare
          firstImage="https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/ztej7qikgddcvdme1b3y.jpg"
          secondImage="https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/zi2znwbqllsfazamxkty.jpg"
          firstImageClassName="object-cover object-left-top w-full"
          secondImageClassname="object-cover object-left-top w-full"
          className="w-full h-full rounded-[22px] md:rounded-lg"
          slideMode="hover"
          autoplay={true}
        />
      </div>
    </div>
    </div>
  );
};

export default About;
