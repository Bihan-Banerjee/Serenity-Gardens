import { SidebarProvider } from "../components/ui/sidebar";
import  {CartSidebar}  from "./CartSidebar";
import MenuPage from "./MenuPage";
import React, { useState } from "react";
export default function MenuWithSidebar() {
  const [cart, setCart] = useState<CartItem[]>([]); 
  return (
    <SidebarProvider>
      <CartSidebar cart={cart} setCart={setCart}/>
      <main className="ml-auto w-full p-4">
        <MenuPage />
      </main>
    </SidebarProvider>
  );
}
