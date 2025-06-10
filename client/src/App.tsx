import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Explore from './pages/Explore';
import Gallery from './pages/Gallery';
import Reviews from './pages/Reviews';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import {
  Navbar,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
} from "@/components/ui/resizable-navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Menu from './pages/Menu';
import { Toaster } from "react-hot-toast";
import AdminDashboard from './pages/AdminDashboard';
import CheckoutPage from './pages/Checkout';
import PaymentPage from './pages/Payment';
import MyProfile from './pages/MyProfile';
import UpcomingPlans from './pages/UpcomingPlans';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const isAdmin = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.isAdmin === true;
  } catch (err) {
    return false;
  }
};

const RedirectWithToast = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error("You are not authorized to access the admin panel");
    navigate("/shop");
  }, []);

  return null;
};



const App = () => {

  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Gallery", link: "/gallery" },
    { name: "Reviews", link: "/reviews" },
    { name: "Upcoming Plans", link: "/upcoming-plans" },
    { name: "Explore", link: "/explore" },
    { name: "Menu", link: "/menu" },
    { name: "My Profile", link: "/my-profile" },
    { name: "Sign In", link: "/shop" },
  ];

  return (
    <Router>
      <AuroraBackground>
        <Navbar>
          <NavItems items={navLinks} onItemClick={() => setMobileOpen(false)} />
        </Navbar>
        <MobileNav visible>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle isOpen={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} />
          </MobileNavHeader>
          <MobileNavMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
            {navLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className="w-full py-2 text-black dark:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </MobileNavMenu>
        </MobileNav>
        <div className="p-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/checkout" element={<CheckoutPage/>} />
            <Route path="/payment" element={<PaymentPage/>} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/upcoming-plans" element={<UpcomingPlans />} />
            <Route
              path="/admin"
              element={isAdmin() ? <AdminDashboard /> : <RedirectWithToast />}
            />
          </Routes>
          <Toaster position="top-right" reverseOrder={false} />
        </div>
      </AuroraBackground>
    </Router>
  );
};

export default App;
