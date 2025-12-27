import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as HotToaster } from 'react-hot-toast';
import { useAuthStore } from '@/hooks/useAuthStore';
import { CustomCursor } from '@/components/ui/CustomCursor';
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Explore from "./pages/Explore";
import Reviews from "./pages/Reviews";
import UpcomingPlans from "./pages/UpcomingPlans";
import Shop from "./pages/Shop";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ItemManager from './pages/ItemManager';
import OrderManager from './pages/OrderManager';
import MyProfile from './pages/MyProfile';
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/upcoming" element={<UpcomingPlans />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/items" element={<ItemManager />} />
      <Route path="/admin/orders" element={<OrderManager />} />
      <Route path="/profile" element={<MyProfile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouchDevice || isSmallScreen);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Analytics />
        <HotToaster 
          position="top-center" 
          toastOptions={{ 
            style: { 
              background: 'hsl(var(--card))', 
              color: 'hsl(var(--foreground))', 
              border: '1px solid hsl(var(--border))' 
            }
          }} 
        />
        {/* Custom cursor - only on desktop */}
        {!isMobile && <CustomCursor />}
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
