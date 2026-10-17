import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card/DraggableCard";
import {useIsMobile} from "@/hooks/useIsMobile";

import greenhouse from "@/assets/greenhouse.jpg";
import solar from "@/assets/solar.jpg";
import rainwater from "@/assets/rainwater.jpg";
import vermiculture from "@/assets/worm.png";
import pisciculture from "@/assets/pisciculture.jpg";
import mushroom from "@/assets/mushroom.jpg";
import nursery from "@/assets/nursery.jpg";

const items = [
  {
    title: "Pisciculture",
    image: pisciculture,
    tag: "Coming Spring 2026",
    className: "absolute top-6 left-[18%] rotate-[-6deg]",
  },
  {
    title: "Nursery",
    image: nursery,
    tag: "Summer 2026",
    className: "absolute top-10 left-[40%] rotate-[5deg]",
  },
  {
    title: "Mushroom Farming",
    image: mushroom,
    tag: "Fall 2026",
    className: "absolute top-24 left-[60%] rotate-[9deg]",
  },
  {
    title: "Greenhouse Agriculture",
    image: greenhouse,
    tag: "Winter 2026",
    className: "absolute top-40 left-[25%] rotate-[-9deg]",
  },
  {
    title: "Solar Integration",
    image: solar,
    tag: "Spring 2027",
    className: "absolute top-28 left-[50%] rotate-[2deg]",
  },
  {
    title: "Rainwater Harvesting",
    image: rainwater,
    tag: "Spring 2027",
    className: "absolute top-28 left-[50%] rotate-[2deg]",
  },
  {
    title: "Eco Workshop on Vermiculture",
    image: vermiculture,
    tag: "Spring 2028",
    className: "absolute top-28 left-[50%] rotate-[2deg]",
  },
];

const UpcomingPlans = () => {
  const isMobile = useIsMobile();

  return (
    <Layout>
      <section className="pt-20 pb-20 px-4 min-h-screen">
        <div className="container mx-auto max-w-6xl">
          {/* Heading */}
          <div className="text-center mb-10">
            <span className="text-primary font-medium tracking-wider uppercase text-m md:text-lg">
              Coming Soon
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2">
              Upcoming Plans
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Drag and toss each card to explore what is blooming next at
              Serenity Gardens.
            </p>
          </div>

          {/* Draggable cards */}
          {isMobile ? (
            <div className="flex flex-col gap-8 items-center justify-center mt-8">
              {items.map((item) => (
                <div
                  key={item.title}
                  className="w-full max-w-xs bg-card border border-border rounded-xl shadow-xl p-4"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-lg">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground text-center">
                    {item.title}
                  </h3>
                  <p className="text-xs text-primary text-center mt-1">
                    {item.tag}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <DraggableCardContainer className="mt-10">
              <p className="absolute top-1/2 left-1/2 max-w-sm -translate-x-1/2 -translate-y-2/3 text-center text-xl md:text-3xl font-semibold text-muted-foreground/70 pointer-events-none">
                Drag the plans around and see how your future garden will grow.
              </p>
              {items.map((item) => (
                <DraggableCardBody key={item.title} className={item.className}>
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="pointer-events-none relative z-10 h-64 w-64 md:h-72 md:w-72 object-cover rounded-lg"
                  />
                  <h3 className="mt-4 text-center text-lg md:text-2xl font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-primary text-center mt-1">
                    {item.tag}
                  </p>
                </DraggableCardBody>
              ))}
            </DraggableCardContainer>
          )}

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 max-w-3xl mx-auto"
          >
            <h2 className="font-serif text-2xl font-bold text-foreground text-center mb-12">
              Development Timeline
            </h2>

            <div className="space-y-8">
              {items.map((plan, index) => (
                <motion.div
                  key={plan.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-28 text-right text-sm text-primary font-medium">
                    {plan.tag}
                  </div>
                  <div className="w-4 h-4 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1 bg-card border border-border rounded-lg p-4">
                    <h3 className="font-semibold text-foreground">
                      {plan.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default UpcomingPlans;
