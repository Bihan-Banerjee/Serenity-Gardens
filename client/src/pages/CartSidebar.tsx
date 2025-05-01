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

export function CartSidebar() {
  const { cart, removeItem, updateQuantity } = useCartStore();
  const { isOpen, setOpen } = useSidebar(); 
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      console.log("Clicked element:", target, "Sidebar ref:", sidebarRef.current);

      // If clicked inside the sidebar → don't close
      if (sidebarRef.current && sidebarRef.current.contains(target)) {
        return;
      }
  
      // If clicked on or inside an element marked to ignore → don't close
      if (target.closest('[data-ignore-outside-click]')) {
        return;
      }
  
      // Otherwise, close sidebar
      setOpen(false);
    };
  
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setOpen]);
  return (
    <>
      

      <Sidebar side="right" variant="sidebar" ref={sidebarRef}>
        

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
            <Button className="w-full" onClick={() => navigate("/checkout")}>
              Proceed to Buy
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
