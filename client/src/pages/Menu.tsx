import { SidebarProvider } from "../components/ui/sidebar";
import  {CartSidebar}  from "./CartSidebar";
import MenuPage from "./MenuPage";
export default function MenuWithSidebar() {
  return (
    <SidebarProvider>
      <CartSidebar/>
      <main className="ml-auto w-full p-4">
        <MenuPage />
      </main>
    </SidebarProvider>
  );
}
