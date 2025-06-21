import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { AuroraText } from "@/components/magicui/aurora-text";
import useIsMobile from "@/hooks/useIsMobile";

const UpcomingPlans = () => {
  const isMobile = useIsMobile();
  const items = [
    {
      title: "Solar Integration",
      image:
        "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1748484638/solar_coulby.jpg",
      className: "absolute top-5 left-[40%] rotate-[8deg]",
    },
    {
      title: "Rainwater Harvesting",
      image:
        "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1748484636/rainwater-harvesting-in-india_zf0qyf.jpg",
      className: "absolute top-32 left-[55%] rotate-[10deg]",
    },
    {
      title: "Eco Workshop on Vermiculture",
      image:
        "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1748484635/vermiculture_tm3cbx.jpg",
      className: "absolute top-20 right-[35%] rotate-[2deg]",
    },
    {
      title: "Greenhouse Agriculture",
      image:
        "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1748484636/greenhouse_ypk0zo.jpg",
      className: "absolute top-24 left-[45%] rotate-[-7deg]",
    },
    {
      title: "Mushroom Farming",
      image:
        "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1748484635/mushroom_jtfxp8.jpg",
      className: "absolute top-8 left-[30%] rotate-[4deg]",
    },{
      title: "Nursery",
      image:
        "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1748484638/nursery_uvbrfl.jpg",
      className: "absolute top-10 left-[20%] rotate-[-5deg]",
    },
    {
      title: "Pisciculture",
      image:
        "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1748484635/pisciculture_i25l1s.webp",
      className: "absolute top-40 left-[25%] rotate-[-7deg]",
    },
  ];
  return (
    <div className={`min-h-screen pt-32 px-6 ${isMobile ? "min-w-full" : "min-w-[100rem]"} mx-auto overflow-x-hidden w-full`}>
        <div className="w-full px-1 md:px-8 flex items-center justify-center">
            <AuroraText className="text-4xl md:text-6xl mb-10 font-bold flex items-center justify-center text-center">
                Upcoming Plans
            </AuroraText>   
        </div>
      <p className="text-lg text-center text-white dark:text-gray-300 mb-10 max-w-2xl mx-auto">
        Stay tuned for exciting updates!<br /> Here’s a glimpse of what's coming soon at Serenity Gardens.
      </p>
      {isMobile ? (
        <div className="flex flex-col gap-10 items-center justify-center pb-10">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <img
                src={item.image}
                alt={item.title}
                className="h-60 w-60 object-cover rounded-lg shadow-lg"
                loading="lazy"
              />
              <h3 className="mt-3 text-lg font-semibold text-neutral-300 text-center">{item.title}</h3>
            </div>
          ))}
        </div>
      ) : (
        <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
        <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-400 md:text-4xl dark:text-neutral-800">
          And much much more!!!
        </p>
        {items.map((item) => (
          <DraggableCardBody className={item.className}>
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="pointer-events-none relative z-10 h-80 w-80 object-cover"
            />
            <h3 className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
              {item.title}
            </h3>
          </DraggableCardBody>
        ))}
      </DraggableCardContainer>
      )}
    </div>
  );
};

export default UpcomingPlans;
