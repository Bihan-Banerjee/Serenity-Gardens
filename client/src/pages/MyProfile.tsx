"use client";
import { AuroraText } from "@/components/magicui/aurora-text";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
interface Order {
  _id: string;
  items: { name: string; quantity: number }[];
  totalAmount: number;
  paid: boolean;
  createdAt: string;
}

export default function MyProfile() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("https://serenity-gardens.onrender.com/api/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch your orders");

      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      toast.error(err.message || "Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  return (
    <div className="min-h-screen mt-28 px-4 py-10">
       <Button
        className="fixed bottom-4 left-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
        onClick={logout}
      >
        Logout
      </Button>
      
      <AuroraText className="text-3xl font-bold ml-13.5 mb-4">My Orders</AuroraText>
      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow">
              <p className="font-bold mb-1">
                Date: {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>Status: {order.paid ? "✅ Paid" : "❌ Unpaid"}</p>
              <p>Total: ₹{order.totalAmount}</p>
              <ul className="mt-2 text-sm list-disc ml-4">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
