"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/useCartStore";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function CheckoutPage() {
  const { items: cart } = useCartStore();  
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    if (!isAuthenticated) {
      alert("Please log in to proceed to checkout.");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleConfirmPayment = () => {
    alert("Redirecting to payment portal...");
    navigate("/payment");
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <section className="py-20 px-4">
          <div className="container mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              Your cart is empty.
            </h2>
            <p className="text-muted-foreground mb-6">
              Add some items from our shop before proceeding to checkout.
            </p>
            <Button onClick={() => navigate("/menu")}>Go Back to Shop</Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-8">
            Checkout
          </h1>

          <div className="bg-card border border-border rounded-xl shadow-lg p-6 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}  // ✅ _id, not id
                className="flex items-center justify-between border-b border-border/60 pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{item.name}</span>
                  <span className="text-sm text-muted-foreground">
                    Qty: {item.quantity} · ₹{item.price} each
                  </span>
                </div>
                <span className="font-semibold text-foreground">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-lg font-serif font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-primary">₹{total}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => navigate("/menu")}
            >
              Continue Shopping
            </Button>
            <Button
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              onClick={handleConfirmPayment}
            >
              Confirm & Proceed to Pay
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
