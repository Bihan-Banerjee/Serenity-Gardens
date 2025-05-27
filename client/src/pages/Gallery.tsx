"use client";
import Carousel from "@/components/ui/carousel";

const Gallery = () => {
  const slides = [
    {
      title: "Sunset Bliss",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/pg04ahdxekzcrtajcuwz.jpg",
    },
    {
      title: "Colorful Blooms",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/nxg3svvd6hqg4jxcounn.jpg",
    },
    {
      title: "Blooming Gardens",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/awl2oyxrj9ahhpgdnpvr.jpg",
    },
    {
      title: "Blooming Gardens",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/jjvvthkzp2ychq8n5bhl.jpg",
    },
    {
      title: "Harvest Season",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/jllt6lujrz0oqdblbjni.jpg",
    },
    {
      title: "Sunset Bliss",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/ahlagwda7qxmn6bu0eg6.jpg",
    },
    {
      title: "Colorful Blooms",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/snuootxbedmhpy09lzie.jpg",
    },
    {
      title: "Blooming Gardens",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/d5t0eg5tq584yzooycem.jpg",
    },
    {
      title: "Harvest Season",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/ibdeyxi3jveyr3haywum.jpg",
    },
    {
      title: "Harvest Season",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/lhzvekih300i7eucypyo.jpg",
    },
    {
      title: "Sunset Bliss",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/zww1tqnxhcxqj3kvipbc.jpg",
    },
    {
      title: "Colorful Blooms",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/hr8dz5acvwvdpa427txt.jpg",
    },
    {
      title: "Blooming Gardens",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/gxjkyg7yaz25qrv3ietb.jpg",
    },
    {
      title: "Harvest Season",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/ve16mdjatbtj5ml1elrs.jpg",
    },
    {
      title: "Sunset Bliss",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/qzb7kxjiaubde9wy3ebb.jpg",
    },
    {
      title: "Colorful Blooms",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/ktkh0k9sc8gxncrrqkui.jpg",
    },
    {
      title: "Blooming Gardens",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/uktojhjpvwvbchczjcax.jpg",
    },
    {
      title: "Harvest Season",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/zppnz7fi70kxufeuwy7a.jpg",
    },
    {
      title: "Sunset Bliss",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/xuqza6sx3fvlvu7ctyrn.jpg",
    },
    {
      title: "Colorful Blooms",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/nxg3svvd6hqg4jxcounn.jpg",
    },{
      title: "Blooming Gardens",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/yqagkpovtdx5vb84bmgr.jpg",
    },
    {
      title: "Harvest Season",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/ztej7qikgddcvdme1b3y.jpg",
    },
    {
      title: "Sunset Bliss",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/zi2znwbqllsfazamxkty.jpg",
    },
    {
      title: "Colorful Blooms",
      src: "https://res.cloudinary.com/drj7t97rd/image/upload/v1747575957/serenity/images/fcrmznksntlzxqg0hswn.jpg",
    },
  ];

  return (
    <div className="mt-30 flex flex-col items-center justify-center pb-20">
      <h2 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">
        Gallery
      </h2>
      <p className="text-center text-white mb-8 max-w-xl">
        Photos and videos capturing the beauty of Serenity Gardens.
      </p>

      <Carousel slides={slides} />
    </div>
  );
};

export default Gallery;
