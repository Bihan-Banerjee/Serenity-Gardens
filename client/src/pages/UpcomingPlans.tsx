"use client";

import React from "react";
import { AuroraText } from "@/components/magicui/aurora-text";
const UpcomingPlans = () => {
  return (
    <div className="min-h-screen pt-32 px-6 max-w-7xl mx-auto">
        <div className="w-full px-1 md:px-8 flex items-center justify-center">
            <AuroraText className="text-4xl md:text-6xl mb-10 font-bold flex items-center justify-center text-center">
                Upcoming Plans
            </AuroraText>   
        </div>
      <p className="text-lg text-center text-white dark:text-gray-300 mb-12 max-w-2xl mx-auto">
        Stay tuned for exciting updates! Here’s a glimpse of what's coming soon at Serenity Gardens.
      </p>

      {/* Replace these placeholders with actual upcoming plan components/cards */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
        <div className="p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Organic Juice Bar Launch
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Freshly squeezed fruit and veggie juices to keep you healthy and refreshed.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Community Tree Plantation Drive
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Join us in our mission to plant 500+ trees around Serenity Gardens.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpcomingPlans;
