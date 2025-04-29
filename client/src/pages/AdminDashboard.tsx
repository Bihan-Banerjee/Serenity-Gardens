"use client";
import React from "react";
import ItemManager from "@/components/admin/ItemManager";
import OrderManager from "@/components/admin/OrderManager";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col gap-10 p-8 mt-28">
      <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
        Admin Dashboard
      </h1>

      {/* Section to manage menu items */}
      <section className="bg-white dark:bg-neutral-900 shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl text-black dark:text-black font-bold mb-6 text-center">Manage Items</h2>
        <ItemManager />
      </section>

      {/* Section to manage orders */}
      <section className="bg-white dark:bg-neutral-900 shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl text-black dark:text-black font-bold mb-6 text-center">Manage Orders</h2>
        <OrderManager />
      </section>
    </div>
  );
};

export default AdminDashboard;
