"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

type OrderItem = {
  name: string;
  quantity: number;
};

type Order = {
  _id: string;
  paid: boolean;
  userId: {
    name: string;
    email: string;
  };
  items: OrderItem[];
};

const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://serenity-gardens.onrender.com/api/orders");
      setOrders(res.data);
    } catch (err) {
      toast.error("Error fetching orders");
    }
  };

  const handleMarkPaid = async (id:string) => {
    try {
      await axios.patch(`https://serenity-gardens.onrender.com/api/orders/${id}`, { paid: true });
      toast.success("Order marked as paid!");
      fetchOrders();
    } catch (err) {
      toast.error("Error marking paid");
    }
  };

   const handleDeleteOrder = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://serenity-gardens.onrender.com/api/orders/${id}`);
      toast.success("Order deleted successfully");
      fetchOrders();
    } catch (err) {
      toast.error("Error deleting order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order._id} className="p-4 border rounded">
          <h3 className="font-bold text-lg text-black">
            User: {order.userId.name} ({order.userId.email})
          </h3>
          <p className="text-black">Status: {order.paid ? "✅ Paid" : "❌ Unpaid"}</p>
          <ul className="list-disc ml-6 mt-2">
            {order.items.map((item, idx) => (
              <li className="text-black" key={idx}>
                {item.name} x {item.quantity}
              </li>
            ))}
          </ul>
          {!order.paid && (
            <button
              onClick={() => handleMarkPaid(order._id)}
              className="mt-4 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            >
              Mark Paid
            </button>
          )}
          <button
              onClick={() => handleDeleteOrder(order._id)}
              className="bg-red-600 ml-2 text-white px-4 py-1 rounded hover:bg-red-700"
            >
              Remove
            </button>
        </div>
      ))}
    </div>
  );
};

export default OrderManager;
