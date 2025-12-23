import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { AuroraText } from "@/components/magicui/aurora-text";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "@/lib/auth";
import api from "@/lib/axiosConfig";

interface Order {
  _id: string;
  items: { name: string; quantity: number }[];
  totalAmount: number;
  paid: boolean;
  createdAt: string;
}

const MyProfile = () => {
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
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch (err: any) {
      toast.error(err?.message || "Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  return (
    <Layout>
      <section className="min-h-screen pt-28 pb-16 px-4">
        <Button
          className="fixed bottom-4 left-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
          onClick={logout}
        >
          Logout
        </Button>

        <div className="container mx-auto max-w-4xl">
          <AuroraText className="text-3xl md:text-4xl font-bold mb-6">
            My Orders
          </AuroraText>

          {loading ? (
            <p className="text-center text-muted-foreground">
              Loading orders...
            </p>
          ) : orders.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p>No orders found.</p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => navigate("/menu")}
              >
                Go to Shop
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-card border border-border rounded-xl shadow-md p-4 md:p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                    <p className="font-serif font-semibold text-foreground">
                      Date:{" "}
                      {new Date(order.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-full ${
                        order.paid
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.paid ? "Paid" : "Unpaid"}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    Order ID: {order._id}
                  </p>

                  <ul className="mt-2 text-sm list-disc ml-4 space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="text-foreground">
                        {item.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Amount
                    </span>
                    <span className="text-lg font-bold text-primary">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MyProfile;
