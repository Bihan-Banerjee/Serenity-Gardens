import { FocusCards } from "@/components/ui/focus-cards";
import { AuroraText } from "@/components/magicui/aurora-text";
import { Compare } from "@/components/ui/compare";
import useIsMobile from "@/hooks/useIsMobile";

const About = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`mx-auto mt-40 ${isMobile ? "px-4 overflow-x-hidden" : "max-w-7xl px-6"}`}>
      <div className={`${isMobile ? "max-w-full" : "max-w-2xl"} mx-auto mb-12`}>
        <div className={`w-full flex items-center justify-center ${isMobile ? "px-2" : "px-1 md:px-8"}`}>
          <AuroraText className={`font-bold text-center ${isMobile ? "text-3xl mb-6" : "text-4xl md:text-6xl mb-10"}`}>
            About Us
          </AuroraText>
        </div>
        <p className={`${isMobile ? "text-base" : "text-lg"} text-white`}>
          What began as parents’ wish to see a combined venture between the brothers, ‘Serenity Gardens’ has become a reflection of the close familial ties and much more...
        </p>
      </div>

      <div className={`w-full flex items-center justify-center ${isMobile ? "px-2" : "px-1 md:px-8"}`}>
        <AuroraText className={`font-bold text-center ${isMobile ? "text-3xl" : "text-4xl md:text-6xl"}`}>
          Meet the Family
        </AuroraText>
      </div>
      <div className={`mx-auto ${isMobile ? "mt-10 mb-14" : "w-5xl mb-20 mt-30 px-4"}`}>
        <FocusCards
          redirectOnClick={false}
          cards={[
            { title: "Jeja", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1749262436/IMG-20250105-WA0358_s951gn.jpg" },
            { title: "Jemma", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1749262437/IMG-20250607-WA0003_idmwey.jpg" },
            { title: "Titi Didi", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1749262437/IMG-20250327-WA0010_vkvozh.jpg" },
            { title: "Baba", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1749262437/IMG-20240909-WA0044_hyishp.jpg" },
            { title: "Ma", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1749262437/IMG-20250607-WA0004_ubpv1x.jpg" },
            { title: "Gablu", src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1749262437/IMG-20250521-WA0198_db36hz.jpg" },
          ]}
        />
      </div>

      <div className={`w-full flex items-center justify-center ${isMobile ? "px-2" : "px-1 md:px-8"}`}>
        <AuroraText className={`font-bold text-center ${isMobile ? "text-3xl" : "text-4xl md:text-6xl"}`}>
          Before VS After
        </AuroraText>
      </div>

      <div className={`space-y-12 mb-20 ${isMobile ? "px-2" : "px-4"}`}>
        {[
          {
            before: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1748433093/oldhouse_gfbe4s.jpg",
            after: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1748433090/bhalochobi_wffpic.jpg",
            caption: "Transformation of the house area over time.",
          },
          {
            before: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1748433093/oldground_vhlxeo.jpg",
            after: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1748433090/beforestorm_udqr99.jpg",
            caption: "Evolution of the lawn.",
          },
          {
            before: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1748433092/oldgreenhouse_wfri5x.jpg",
            after: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1748433094/greenhouse_d4pwwu.jpg",
            caption: "Greenhouse area evolving across monsoons.",
          },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className={`w-full ${isMobile ? " h-[40vh]" : " h-[70vh]"} px-1 md:px-8 flex items-center justify-center [perspective:800px] [transform-style:preserve-3d]`}>
              <div
                style={{
                  transform: "rotateX(15deg) translateZ(80px)",
                }}
                className={`p-2 md:p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 mx-auto ${
                  isMobile ? "w-[95%] h-[30vh]" : "w-[90%] h-[40vh] md:w-[70%] md:h-[50vh]"
                }`}
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
            <p className="text-white text-base text-center mt-2 max-w-xl">
              {item.caption}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
