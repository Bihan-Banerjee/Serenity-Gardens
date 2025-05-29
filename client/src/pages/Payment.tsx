"use client";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCartStore } from "./useCartStore";
import axios from "axios";
import { toast } from "react-hot-toast";
export default function PaymentPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCOD = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to proceed.");
      navigate("/login");
      return;
  }
    try {
        const token = localStorage.getItem("token");
        await axios.post(
            "http://localhost:5000/api/orders",
            { items: cart, paid: false },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
      clearCart();
      toast.success("Order placed as Cash on Delivery!");
      navigate("/menu");
    } catch (err) {
      toast.error("Failed to place COD order. Please try again.");
    }
  };

  const handleRazorpayPayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to proceed.");
      navigate("/login");
      return;
    }
    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: total * 100, 
      currency: "INR",
      name: "Serenity Gardens",
      description: "Order Payment",
      handler: async function (response) {
        try {
          await axios.post("http://localhost:5000/api/orders", {
            items: cart,
            paid: true,
            razorpayPaymentId: response.razorpay_payment_id,
          });
          clearCart();
          toast.success("Payment successful and order placed!");
          navigate("/menu");
        } catch (err) {
          toast.error("Order failed after payment. Please contact support.");
        }
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", function (response: any) {
      toast.error("Payment failed. Please try again.");
    });
    rzp.open();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 space-y-6">
      <h2 className="text-3xl font-bold text-center">Checkout</h2>
      <p className="text-white text-center max-w-md">
        Total amount: ₹{total}
      </p>

      <div className="flex space-x-4">
        <Button
          className="bg-yellow-600 hover:bg-yellow-700"
          onClick={handleCOD}
        >
          Cash on Delivery
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={handleRazorpayPayment}
        >
          Pay Now
        </Button>
      </div>

      <Button variant="outline" onClick={() => navigate("/menu")}>
        Cancel and Return
      </Button>
    </div>
  );
}
