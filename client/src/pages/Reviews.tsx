import { Marquee } from "@/components/magicui/marquee"; 
import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { AuroraText } from "@/components/magicui/aurora-text";
import useIsMobile from "@/hooks/useIsMobile";
const Reviews = () => {
  const isMobile = useIsMobile();
  const [form, setForm] = useState({ name: "", review: "" });

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to submit feedback.");
      return;
    }
  
    try {
      const res = await fetch("https://serenity-gardens.onrender.com/api/reviews/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
    
      const data = await res.json();
    
      if (!res.ok) throw new Error(data.message || "Failed to submit feedback");
    
      toast.success("Thank you for your feedback!");
      setForm({ name: "", review: "" });
    } catch (err: any) {
      toast.error(err.message || "Error submitting feedback");
    }
  };

  const testimonials = [
    {
      name: "Suvankar Chakraborty",
      review: "We visited this Serenity gardens for our get together with old friends on 22/12/24. The ambience of the garden is too good. The hospitality by the caretaker,Laltu was amazing and food served was tasty and hygienic, thanks to Swarup and his brother Arup. I would highly recommend this place to for family get together.",
      img: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747576918/serenity/reviews/bda4vmw4mehswejygvor.png",
    },
    {
      name: "Soma Gupta",
      review: "It is an excellent farm house with lot of places for the children to play, for taking colourful snaps and lot of adda. The food and the hospitality served there by Laltu & his wife, needs special mention... really they were too tasty👌",
      img: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747576918/serenity/reviews/zlqgjt3lm6b7jalhveah.png",
    },
    {
      name: "Parna Banerjee",
      review: "My recent visit at Serenity Gardens in Baruipur was nothing short of delightful. Nestled in a serene and green environment, the retreat offered the perfect escape from the bustle of daily life. The blend of modern amenities with a tranquil, nature-filled atmosphere truly set it apart...",
      img: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747576918/serenity/reviews/unypd2i70nlq0imyafmo.png",
    },
    {
      name: "Kankani Mukherjee",
      review: "Mesmerising atmosphere,eye soothing greenery with various fruits,vegetable and flower plants.A place which keeps away all the stress and rejuvenates everybody.Ideal place for get together with all the amenities. A must visit place to feel the nature very near to the city.",
      img: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747576918/serenity/reviews/jxh7deq1ujr89ujs02zq.png",
    },
    {
      name: "Sutreyi",
      review: "It is B-E-A-U-T-I-F-U-L...💚",
      img: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747576918/serenity/reviews/dfshdxpysbmpulync8s1.png",
    },
    {
      name: "Madhumita Chatterjee",
      review: "Serenity Garden , what an appropriate and significant name of this huge tranquil plot of land one can only gaze with appreciation. Much effort has been taken by the owners to beautify this area with various flowers, fruits and vegetables, and is also ornamented with lovely painting and decorative planter. Worth spending a whole day for relaxation...",
      img: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747576918/serenity/reviews/vibfhfnc2nvxn4gnmi0m.png",
    },
    {
      name: "SRABANI CHAKRABORTY",
      review: "The scenic beauty of this place is amezing,every part is full of greenery.",
      img: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747576918/serenity/reviews/qnv8b492tbgew4fkq8au.png",
    },
    {
      name: "Paramita Roy",
      review: "I along with my friends visited Serenity Gardens on last Sunday. It’s an aesthetically decorated, very neat and well maintained Farm House. Food was also very amazing . Worth a visit.",
      img: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747576918/serenity/reviews/mrutcikbaf7ldtxktpvy.png",
    },
    {
      name: "soma dasgupta",
      review: "Very nice place & very large area. I would highly recommend it for a family picnic . Enjoyed a lot with my buddies.",
      img: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747576918/serenity/reviews/tilrklmafxa4qllchpqw.png",
    },
    {
      name: "Tamali Ghosh",
      review: "I wanted to take a moment to express my heartfelt gratitude for hosting us at your beautiful farmhouse. The entire experience was absolutely wonderful and truly unforgettable! From the moment we arrived, we were captivated by the picturesque surroundings. The serene landscape, lush greenery, and charming farmhouse created the perfect setting for a relaxing day out...",
      img: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747576918/serenity/reviews/o9iu64o306czn9as8nxf.png",
    },
    {
      name: "Munmun Basu",
      review: "Excellent food,superb hospitality, beauty and peace of nature prevail everywhere in this place",
      img: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747576918/serenity/reviews/xutld21di7lvbslmskkb.png",
    },
    {
      name: "Dola Ray",
      review: "A fantastic experience at Serenity Gardens. Exceptional arrangements and tasty food, surrounded by pristine greens. A walk down the gardens and pond was pure joy. An island of peace and serenity indeed.",
      img: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747576918/serenity/reviews/l06eh1wgorrc4d8rmecj.png",
    },
    {
      name: "dipankar bandyopadhyay",
      review: "Open up to Mother Nature for tranquility and peace",
      img: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747576918/serenity/reviews/mpmnbt7dnrmyy1ranskx.png",
    },
    {
      name: "Arun Thakur",
      review: "Very good place...",
      img: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747576918/serenity/reviews/bnaooludw4aofky58zon.png",
    },
    {
      name: "DR ARINDAM MANDAL",
      review: "What a wonderful place surrounded by nature,play ground ,water body and a beautiful bunglow❤️",
      img: "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1747576918/serenity/reviews/xgepuv0e5fxkh3omfjod.png",
    },
  ];

  const splitTestimonials = () => {
    const chunkSize = Math.ceil(testimonials.length / 3);
    const chunks = [];
    for (let i = 0; i < testimonials.length; i += chunkSize) {
      chunks.push(testimonials.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const [firstRow, secondRow, thirdRow] = splitTestimonials();

  return (
    <div className={`w-full ${isMobile ? "pt-24 pb-8 px-2 overflow-hidden" : "pt-40 px-6 pb-20"}`}>
      {/* Section 1 - Marquee Testimonials */}
      
      <div className="w-full px-1 md:px-8 mt-0 mb-5 flex items-center justify-center">
        <AuroraText className={`${isMobile ? "text-3xl" : "text-4xl md:text-6xl"} font-bold flex items-center justify-center text-center`}>
          What People Say
        </AuroraText>
      </div>
      <section className={`w-full max-w-7xl px-2 ${isMobile ? "mx-auto" : ""}`}>
        <div className={`${isMobile ? "space-y-4" : "space-y-8"}`}>
          {isMobile ? (
            
              <Marquee className={`${isMobile ? "gap-4" : "gap-6"}`}>
                {firstRow.map((testimonial, idx) => (
                  <div
                    key={`first-${idx}`}
                    className="flex flex-col items-center justify-center bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-lg min-w-[250px] max-w-xs text-center"
                  >
                    <img
                      src={testimonial.img}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mb-4"
                    />
                    <h3 className="font-semibold text-lg text-gray-600 dark:text-gray-300">{testimonial.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{testimonial.review}</p>
                  </div>
                ))}
              </Marquee>
          ):
            (
              <>
              <Marquee className={`${isMobile ? "gap-4" : "gap-6"}`}>
                {firstRow.map((testimonial, idx) => (
                  <div
                    key={`first-${idx}`}
                    className="flex flex-col items-center justify-center bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-lg min-w-[250px] max-w-xs text-center"
                  >
                    <img
                      src={testimonial.img}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mb-4"
                    />
                    <h3 className="font-semibold text-lg text-gray-600 dark:text-gray-300">{testimonial.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{testimonial.review}</p>
                  </div>
                ))}
              </Marquee>
              
              
              <Marquee reverse className={`${isMobile ? "gap-4" : "gap-6"}`}>
                {secondRow.map((testimonial, idx) => (
                  <div
                    key={`second-${idx}`}
                    className="flex flex-col items-center justify-center bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-lg min-w-[250px] max-w-xs text-center"
                  >
                    <img
                      src={testimonial.img}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mb-4"
                    />
                    <h3 className="font-semibold text-lg text-gray-600 dark:text-gray-300">{testimonial.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{testimonial.review}</p>
                  </div>
                ))}
              </Marquee>
              
              
              <Marquee className={`${isMobile ? "gap-4" : "gap-6"}`}>
                {thirdRow.map((testimonial, idx) => (
                  <div
                    key={`third-${idx}`}
                    className="flex flex-col items-center justify-center bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-lg min-w-[250px] max-w-xs text-center"
                  >
                    <img
                      src={testimonial.img}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mb-4"
                    />
                    <h3 className="font-semibold text-lg text-gray-600 dark:text-gray-300">{testimonial.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{testimonial.review}</p>
                  </div>
                ))}
              </Marquee>
              </>
            )
          }
        </div>
      </section>

      {/* Section 2 - Feedback Form */}
      <section className={`${isMobile ? "px-2 mt-12" : "mt-20 max-w-xl px-4"} mx-auto pb-20`}>
        <h2 className="text-3xl font-bold text-white text-center mb-4">Share Your Feedback</h2>
        <p className="text-white text-center mb-6">
          We would love to hear about your experience!
        </p>
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-2 border rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Your Review"
            className="w-full p-2 border rounded h-24"
            value={form.review}
            onChange={(e) => setForm({ ...form, review: e.target.value })}
            required
          ></textarea>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full transition"
          >
            Submit
          </button>
        </form>
      </section>
    </div>
  );
};

export default Reviews;
