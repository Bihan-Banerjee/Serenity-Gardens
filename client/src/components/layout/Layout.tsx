import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartSidebar } from '@/components/ui/cart/CartSidebar';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export const Layout = ({ children, showFooter = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        {children}
      </main>
      {showFooter && <Footer />}
      <CartSidebar />
    </div>
  );
};
