"use client";

import { useCartStore } from "./useCartStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { cart } = useCartStore();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to proceed to checkout.");
      navigate("/login");
    }
  }, [navigate]);

  const handleConfirmPayment = () => {
    alert("Redirecting to payment portal...");
    navigate("/payment"); 
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty.</h2>
        <Button onClick={() => navigate("/menu")}>Go Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 px-4">
      <h2 className="text-3xl font-bold">Checkout</h2>
      <div className="w-full max-w-md space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b py-2 text-white dark:text-white"
          >
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <Button
        className="w-full max-w-md bg-green-600 hover:bg-green-700"
        onClick={handleConfirmPayment}
      >
        Confirm & Proceed to Pay
      </Button>
    </div>
  );
}
