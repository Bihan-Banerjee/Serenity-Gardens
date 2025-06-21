import { useState } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import useIsMobile from "@/hooks/useIsMobile";
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
  const isMobile = useIsMobile();
  const handleCardClick = (card: CardType) => {
    if (redirectOnClick && card.link) {
      navigate(card.link);
    }
  };

  return (
    <div
      className={cn(
        "grid gap-6 mx-auto w-full",
        isMobile ? "grid-cols-1 px-4" : "grid-cols-3 md:px-8 max-w-5xl"
      )}
    >
      {cards.map((card, index) => (
        <div
          key={card.title}
          onClick={() => handleCardClick(card)}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "rounded-lg relative overflow-hidden transition-all duration-300 ease-out",
            redirectOnClick && "cursor-pointer",
            hovered !== null && hovered !== index && "blur-sm scale-[0.98]",
            isMobile
              ? "h-48 w-full"
              : "h-60 md:h-96 w-full"
          )}
        >
          <img
            src={card.src}
            alt={card.title}
            loading="lazy"
            className="object-cover absolute w-full h-full inset-0"
          />
          <div
            className={cn(
              "absolute inset-0 bg-black/50 flex items-end py-6 px-4 transition-opacity duration-300",
              hovered === index ? "opacity-100" : "opacity-0"
            )}
          >
            <div className={cn(
              "font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200",
              isMobile ? "text-lg" : "text-2xl"
            )}>
              {card.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
