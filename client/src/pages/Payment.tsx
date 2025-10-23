import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; 
import { useCartStore } from "./useCartStore"; 
import axios from "axios"; 
import { toast } from "react-hot-toast"; 

declare global {
  interface Window { Razorpay: any; }
}

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
        await axios.post( 
            "https://serenity-gardens.onrender.com/api/orders", 
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

    try {
        const orderAmountInPaisa = total * 100; 
        const { data: razorpayOrder } = await axios.post(
            "https://serenity-gardens.onrender.com/api/orders/create-razorpay-order", 
            { amount: orderAmountInPaisa },
            { headers: { Authorization: `Bearer ${token}` } }
        );

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
                    await axios.post("https://serenity-gardens.onrender.com/api/orders/verify-payment", { 
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        items: cart, 
                    }, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    clearCart();
                    toast.success("Payment successful and order placed!");
                    navigate("/menu"); 
                } catch (verifyErr) {
                    console.error("Payment verification/Order creation failed:", verifyErr);
                    toast.error("Order failed after payment. Please contact support.");
                }
            },
            prefill: {
                // Optional: Prefill user details if available
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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 space-y-6">
      <h2 className="text-3xl font-bold text-center">Checkout</h2>
      <p className="text-white text-center max-w-md">
        Total amount: ₹{total}
      </p>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-xs sm:max-w-md justify-center">
        <Button
          className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700"
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

      <Button variant="outline" onClick={() => navigate("/menu")}>
        Cancel and Return
      </Button>
    </div>
  );
}