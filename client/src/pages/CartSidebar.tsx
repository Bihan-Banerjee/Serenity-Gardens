import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { useCartStore } from "./useCartStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export function CartSidebar() {
  const { cart, removeItem, updateQuantity } = useCartStore();
  const { state, setOpen } = useSidebar();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (!sidebarRef.current) return;

    if (sidebarRef.current.classList.contains('collapsed')) {
      console.log("Sidebar visually closed (collapsed class), skipping click check");
      return;
    }

    if (sidebarRef.current.contains(target)) {
      console.log("Clicked inside sidebar — ignoring");
      return;
    }

    if (target.closest('[data-ignore-outside-click]')) {
      console.log("Clicked on ignore area — ignoring");
      return;
    }

    console.log("Clicked outside — closing sidebar");
    setOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen]);
  
  const handleProceedToBuy = () => {
  setOpen(false); // Close cart first
  navigate("/checkout");
};


  return (
    <>
      <Sidebar data-open={state === "expanded" ? "true" : "false"} side="right" variant="sidebar" ref={sidebarRef}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Your Cart</SidebarGroupLabel>
            <SidebarGroupContent>
              {cart.length === 0 && <p className="px-4 text-sm">No items yet.</p>}
              {cart.map((item) => (
                <div key={item.id} className="px-4 py-2 border-b">
                  <p className="font-semibold">{item.name}</p>
                  <p>₹{item.price} x {item.quantity}</p>
                  <div className="flex gap-2 mt-1">
                    <Button size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</Button>
                    <Button size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                    <Button size="sm" variant="destructive" onClick={() => removeItem(item.id)}>Remove</Button>
                  </div>
                </div>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="w-full p-4 space-y-2">
            <div className="font-bold">Total: ₹{total}</div>
            <Button className="w-full" onClick={handleProceedToBuy}>
              Proceed to Buy
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}