"use client";

import { Marquee } from "@/components/magicui/marquee"; // your Marquee component
import React from "react";

const Reviews = () => {
  const testimonials = [
    {
      name: "John Doe",
      review: "Amazing place, felt very close to nature!",
      img: "/john.jpg",
    },
    {
      name: "Jane Smith",
      review: "The gardens were peaceful and beautiful. Loved it!",
      img: "/jane.jpg",
    },
    {
      name: "Alex Johnson",
      review: "Perfect spot for relaxation and rejuvenation!",
      img: "/alex.jpg",
    },
    // add more if you have
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-12 mt-20">
      {/* Section 1 - Marquee Testimonials */}
      <section className="w-full max-w-7xl px-4 space-y-10">
        <h2 className="text-4xl font-bold text-center mb-8">What Visitors Say</h2>

        {/* Three Marquee Rows */}
        <div className="space-y-8">
          {[0, 1, 2].map((row) => (
            <Marquee key={row} reverse={row === 1} className="gap-6">
              {testimonials.map((testimonial, idx) => (
                <div
                  key={`${row}-${idx}`}
                  className="flex flex-col items-center justify-center bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-lg min-w-[250px] max-w-xs text-center"
                >
                  <img
                    src={testimonial.img}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mb-4"
                  />
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{testimonial.review}</p>
                </div>
              ))}
            </Marquee>
          ))}
        </div>
      </section>

      {/* Section 2 - Feedback Form */}
      <section className="mt-20 w-full max-w-xl px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Share Your Feedback</h2>
        <p className="text-gray-600 text-center mb-6">
          We would love to hear about your experience!
        </p>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Your Review"
            className="w-full p-2 border rounded h-24"
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
