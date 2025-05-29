"use client";
import React, { useState } from "react";
import ItemManager from "@/components/admin/ItemManager";
import OrderManager from "@/components/admin/OrderManager";

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState<"items" | "orders">("items");

  return (
    <div className="min-h-screen pt-30 px-4">
      {/* Toggle Buttons */}
      <div className="flex justify-center mb-8 space-x-4">
        <button
          onClick={() => setActiveComponent("items")}
          className={`px-6 py-2 rounded-md font-semibold border transition ${
            activeComponent === "items"
              ? "bg-black text-white"
              : "bg-white text-white dark:bg-neutral-800 dark:text-white"
          }`}
        >
          Item Manager
        </button>
        <button
          onClick={() => setActiveComponent("orders")}
          className={`px-6 py-2 rounded-md font-semibold border transition ${
            activeComponent === "orders"
              ? "bg-black text-white"
              : "bg-white text-white dark:bg-neutral-800 dark:text-white"
          }`}
        >
          Order Manager
        </button>
      </div>

      {/* Content Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow p-6 max-w-6xl mx-auto">
        {activeComponent === "items" ? <ItemManager /> : <OrderManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;
