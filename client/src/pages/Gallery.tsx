"use client";
import Carousel from "@/components/ui/carousel";

const Gallery = () => {
  const slides = [
    {
      title: "Sunset Bliss",
      src: "/images/entrance.jpg",
    },
    {
      title: "Colorful Blooms",
      src: "/images/fields.jpg",
    },
    {
      title: "Blooming Gardens",
      src: "/images/floweringTiles.jpg",
    },
    {
      title: "Blooming Gardens",
      src: "/images/wall.jpg",
    },
    {
      title: "Harvest Season",
      src: "/images/aerial.jpg",
    },
    {
      title: "Sunset Bliss",
      src: "/images/bigFlower.jpg",
    },
    {
      title: "Colorful Blooms",
      src: "/images/bird.jpg",
    },
    {
      title: "Blooming Gardens",
      src: "/images/cabbage.jpg",
    },
    {
      title: "Harvest Season",
      src: "/images/corner.jpg",
    },
    {
      title: "Harvest Season",
      src: "/images/friends.jpg",
    },
    {
      title: "Sunset Bliss",
      src: "/images/garden.jpg",
    },
    {
      title: "Colorful Blooms",
      src: "/images/ghat.jpg",
    },
    {
      title: "Blooming Gardens",
      src: "/images/greenhouse.jpg",
    },
    {
      title: "Harvest Season",
      src: "/images/harvest.jpg",
    },
    {
      title: "Sunset Bliss",
      src: "/images/house.jpg",
    },
    {
      title: "Colorful Blooms",
      src: "/images/peace.jpg",
    },
    {
      title: "Blooming Gardens",
      src: "/images/pond.jpg",
    },
    {
      title: "Harvest Season",
      src: "/images/rose.jpg",
    },
    {
      title: "Sunset Bliss",
      src: "/images/shade.jpg",
    },
    {
      title: "Colorful Blooms",
      src: "/images/sky.jpg",
    },{
      title: "Blooming Gardens",
      src: "/images/swing.jpg",
    },
    {
      title: "Harvest Season",
      src: "/images/tomato.jpg",
    },
    {
      title: "Sunset Bliss",
      src: "/images/vermicomposting.jpg",
    },
    {
      title: "Colorful Blooms",
      src: "/images/yellow.jpg",
    },
  ];

  return (
    <div className="mt-30 flex flex-col items-center justify-center pb-20">
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
