import api from "@/lib/axiosConfig";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/useCartStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import axios from "axios";
import { toast } from "react-hot-toast";

declare global {
  interface Window { Razorpay: any; }
}

export default function PaymentPage() {
  const { items: cart } = useCartStore();  
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    if (!isAuthenticated) {
      alert("Please log in to complete your order.");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (cart.length === 0) {
    return (
      <Layout>
        <section className="py-20 px-4">
          <div className="container mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              No items to checkout.
            </h2>
            <p className="text-muted-foreground mb-6">
              Your cart is empty. Add items and try again.
            </p>
            <Button onClick={() => navigate("/menu")}>Go Back to Shop</Button>
          </div>
        </section>
      </Layout>
    );
  }

  const handleCOD = async () => {
    try {
      await api.post("/orders", { items: cart, paid: false });
      useCartStore.getState().clearCart();
      toast.success("Order placed as Cash on Delivery!");
      navigate("/menu");
    } catch (err) {
      toast.error("Failed to place COD order. Please try again.");
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      const orderAmountInPaisa = total * 100;
      const { data: razorpayOrder } = await api.post("/orders/create-razorpay-order", { amount: orderAmountInPaisa });

      if (!razorpayOrder || !razorpayOrder.id) {
        throw new Error("Failed to create Razorpay order.");
      }

      const options = {
        key: "rzp_live_RWs23oG1CwD8Lb",
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Serenity Gardens",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            await api.post("/orders/verify-payment", { razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: cart, });

            useCartStore.getState().clearCart();
            toast.success("Payment successful and order placed!");
            navigate("/menu");
          } catch (verifyErr) {
            console.error("Payment verification/Order creation failed:", verifyErr);
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

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        console.error("Razorpay Payment Failed:", response.error);
        toast.error(`Payment failed: ${response.error.description || 'Please try again.'}`);
      });

      rzp.open();
    } catch (err: any) {
      console.error("Razorpay initiation failed:", err);
      toast.error(err.message || "Could not initiate payment. Please try again.");
    }
  };

  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-8">
            Secure Payment
          </h1>

          <div className="bg-card border border-border rounded-xl shadow-lg p-8 text-center space-y-6">
            <div className="space-y-2">
              <span className="text-lg font-serif font-semibold text-foreground">Order Total</span>
              <div className="text-3xl font-bold text-primary">₹{total}</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button
                className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white"
                onClick={handleCOD}
              >
                Cash on Delivery
              </Button>
              <Button
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleRazorpayPayment}
              >
                Pay Now with Razorpay
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/checkout")}
            >
              ← Back to Checkout
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
