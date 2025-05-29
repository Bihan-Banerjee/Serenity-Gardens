import { useState } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

type CardType = {
  title: string;
  src: string;
  link?: string;
};

export function FocusCards({
  cards,
  redirectOnClick = false,
}: {
  cards: CardType[];
  redirectOnClick?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const navigate = useNavigate(); 

  const handleCardClick = (card: CardType) => {
    if (redirectOnClick && card.link) {
      navigate(card.link);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
      {cards.map((card, index) => (
        <div
          key={card.title}
          onClick={() => handleCardClick(card)}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out",
            redirectOnClick && "cursor-pointer",
            hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
          )}
        >
          <img
            src={card.src}
            alt={card.title}
            className="object-cover absolute w-full h-full inset-0"
          />
          <div
            className={cn(
              "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
              hovered === index ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
              {card.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
