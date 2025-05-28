import { FocusCards } from "@/components/ui/focus-cards";
import { AuroraText } from "@/components/magicui/aurora-text";
import { Compare } from "@/components/ui/compare";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto mt-40 px-6">
      {/* Intro */}
      <div className="max-w-2xl mx-auto mb-12">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">About Us</h2>
        <p className="text-white text-lg">
          What began as parents’ wish to see a combined venture between the brothers, ‘Serenity Gardens’ has become a reflection of the close familial ties and much more. Nestling amongst the Tematha farm lands, it speaks volumes about supporting a biosustainable economy in form of pisciculture, organic farm produce, and greenhouse resources. The project of ‘Serenity Gardens’ commenced and still continues in the hands of the locals and provides an inspiration to give back to the community in form of free medical and teaching services. This sanctum is a quest to serve Mother Nature while respecting family values and preserving our roots in its every spectrum.
        </p>
      </div>

      {/* Family Section */}
      <div className="w-full px-1 md:px-8 flex items-center justify-center">
        <AuroraText className="text-4xl md:text-6xl font-bold flex items-center justify-center text-center">
          Meet the Family
        </AuroraText>
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

      {/* Compare Section Header */}
      <div className="w-full px-1 md:px-8 flex items-center justify-center">
        <AuroraText className="text-4xl md:text-6xl font-bold flex items-center justify-center text-center">
          Before VS After
        </AuroraText>
      </div>

      {/* Compare Blocks */}
      <div className="space-y-16 mb-20 px-4">
        {[
          {
            before: "https://res.cloudinary.com/drj7t97rd/image/upload/v1748433093/oldhouse_gfbe4s.jpg",
            after: "https://res.cloudinary.com/drj7t97rd/image/upload/v1748433090/bhalochobi_wffpic.jpg",
            caption: "Transformation of the house area over time.",
          },
          {
            before: "https://res.cloudinary.com/drj7t97rd/image/upload/v1748433093/oldground_vhlxeo.jpg",
            after: "https://res.cloudinary.com/drj7t97rd/image/upload/v1748433090/beforestorm_udqr99.jpg",
            caption: "Evolution of the lawn.",
          },
          {
            before: "https://res.cloudinary.com/drj7t97rd/image/upload/v1748433092/oldgreenhouse_wfri5x.jpg",
            after: "https://res.cloudinary.com/drj7t97rd/image/upload/v1748433094/greenhouse_d4pwwu.jpg",
            caption: "Greenhouse area evolving across monsoons.",
          },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className="w-full h-[90vh] px-1 md:px-8 flex items-center justify-center [perspective:800px] [transform-style:preserve-3d]"
            >
              <div
                style={{
                  transform: "rotateX(15deg) translateZ(80px)",
                }}
                className="p-2 md:p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 mx-auto mt-0 w-[90%] h-[40vh] md:w-[70%] md:h-[50vh]"
              >
                <Compare
                  firstImage={item.before}
                  secondImage={item.after}
                  firstImageClassName="object-cover object-left-top w-full"
                  secondImageClassname="object-cover object-left-top w-full"
                  className="w-full h-full rounded-[22px] md:rounded-lg"
                  slideMode="hover"
                  autoplay={true}
                />
              </div>
            </div>
            <p className="text-white text-lg text-center max-w-xl">
              {item.caption}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
