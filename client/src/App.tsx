import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Explore from './pages/Explore';
import Gallery from './pages/Gallery';
import Reviews from './pages/Reviews';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import {Navbar, NavItems} from './components/ui/resizable-navbar';
import { AuroraBackground } from "@/components/ui/aurora-background";
import Menu from './pages/Menu';
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <Router>
      <AuroraBackground>
        <Navbar>
          <NavItems
            items={[
              { name: "Home", link: "/" },
              { name: "About", link: "/about" },
              { name: "Gallery", link: "/gallery" },
              { name: "Reviews", link: "/reviews" },
              { name: "Shop", link: "/shop" },
              { name: "Register", link: "/register" },
              { name: "Login", link: "/login" },
              { name: "Explore", link: "/explore" },
            ]}
            onItemClick={() => console.log("Navbar item clicked!")}
          />
        </Navbar>
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
          </Routes>
          <Toaster position="top-right" reverseOrder={false} />
        </div>
      </AuroraBackground>
    </Router>
  );
};

export default App;
