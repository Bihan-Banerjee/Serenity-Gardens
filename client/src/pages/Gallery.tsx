"use client";
import Carousel from "@/components/ui/carousel";

const Gallery = () => {
  const slides = [
    {
      title: "Blooming Gardens",
      src: "/images/wall.jpg",
    },
    {
      title: "Harvest Season",
      src: "/images/wall.jpg",
    },
    {
      title: "Sunset Bliss",
      src: "/images/wall.jpg",
    },
    {
      title: "Colorful Blooms",
      src: "/images/wall.jpg",
    },
  ];

  return (
    <div className="mt-30 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">
        Gallery
      </h2>
      <p className="text-center text-gray-500 mb-8 max-w-xl">
        Photos and videos capturing the beauty of Serenity Gardens.
      </p>

      <Carousel slides={slides} />
    </div>
  );
};

export default Gallery;
