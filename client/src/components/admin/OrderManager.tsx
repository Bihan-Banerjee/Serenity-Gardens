import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; 
import { logout } from "@/lib/auth"; 

type OrderItem = {
  _id?: string; 
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type UserInfo = {
  _id: string;
  name: string;
  email: string;
}

type Order = {
  _id: string;
  paid: boolean;
  userId: UserInfo | null; 
  items: OrderItem[];
  totalAmount: number; 
  createdAt: string; 
};

const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();
  const fetchOrders = async () => {
     const token = localStorage.getItem("token");
     if (!token) {
       toast.error("Authentication required for admin actions.");
       navigate("/login"); 
       return;
     }

    try {
      const res = await axios.get("https://serenity-gardens.onrender.com/api/orders", {
          headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err); 
      toast.error("Error fetching orders");
       if (axios.isAxiosError(err) && err.response?.status === 401) {
         toast.error("Session expired or invalid. Please log in again.");
         logout(); 
       } else if (axios.isAxiosError(err) && err.response?.status === 403) {
         toast.error("You are not authorized to view orders.");
         navigate("/menu"); 
       }
    }
  };

  const handleMarkPaid = async (id:string) => {
    const token = localStorage.getItem("token"); 
    if (!token) { toast.error("Authentication required."); navigate("/login"); return; }

    try {
      await axios.patch(`https://serenity-gardens.onrender.com/api/orders/${id}`, { paid: true }, {
         headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Order marked as paid!");
      fetchOrders(); 
    } catch (err) {
      console.error("Error marking paid:", err);
      toast.error("Error marking paid");
       if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403) ) {
         logout(); 
       }
    }
  };

   const handleDeleteOrder = async (id: string) => {
     const token = localStorage.getItem("token"); 
     if (!token) { toast.error("Authentication required."); navigate("/login"); return; }

    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://serenity-gardens.onrender.com/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Order deleted successfully");
      fetchOrders(); 
    } catch (err) {
       console.error("Error deleting order:", err);
       toast.error("Error deleting order");
       if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403) ) {
         logout(); 
       }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      {orders.length === 0 && (
         <p className="text-center text-gray-500 dark:text-gray-400">No orders found.</p>
      )}
      {orders.map((order) => (
        <div key={order._id} className="p-4 border rounded bg-gray-50 dark:bg-neutral-700 shadow">
          <h3 className="font-bold text-lg text-black dark:text-white mb-2">
            Order ID: {order._id}
          </h3>
           <p className="text-sm text-gray-700 dark:text-gray-200">
             User: {order.userId ? `${order.userId.name} (${order.userId.email})` : 'User Not Found'}
           </p>
           <p className="text-sm text-gray-700 dark:text-gray-200">
             Date: {new Date(order.createdAt).toLocaleString()}
           </p>
          <p className={`text-sm font-medium ${order.paid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            Status: {order.paid ? "✅ Paid" : "❌ Unpaid"}
            </p>
           <p className="text-sm text-gray-700 dark:text-gray-200">
             Total: ₹{order.totalAmount.toFixed(2)} {/* Added formatting */}
           </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            {order.items.map((item, idx) => (
              <li className="text-sm text-black dark:text-gray-100" key={item.id || idx}> {/* Use item.id if available */}
                {item.name} x {item.quantity} (@ ₹{item.price?.toFixed(2) ?? 'N/A'}) {/* Show price if available */}
              </li>
            ))}
          </ul>
          <div className="mt-4 space-x-2"> {/* Group buttons */}
            {!order.paid && (
              <button
                onClick={() => handleMarkPaid(order._id)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
              >
                Mark Paid
              </button>
            )}
            <button
                onClick={() => handleDeleteOrder(order._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
              >
                Delete Order
              </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderManager;
