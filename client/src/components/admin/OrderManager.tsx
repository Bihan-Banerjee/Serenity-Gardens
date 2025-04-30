"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


const OrderManager = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (err) {
      toast.error("Error fetching orders");
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${id}`, { paid: true });
      toast.success("Order marked as paid!");
      fetchOrders();
    } catch (err) {
      toast.error("Error marking paid");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order._id} className="p-4 border rounded">
          <h3 className="font-bold text-lg">User: {order.userEmail}</h3>
          <p>Status: {order.paid ? "✅ Paid" : "❌ Unpaid"}</p>
          <ul className="list-disc ml-6 mt-2">
            {order.items.map((item, idx) => (
              <li key={idx}>
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
        </div>
      ))}
    </div>
  );
};

export default OrderManager;
