import { AuroraText } from "@/components/magicui/aurora-text";
import { useCartStore, CartItem } from "./useCartStore";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { logout } from "@/lib/auth";
import { toast } from "react-hot-toast";
import useIsMobile from "@/hooks/useIsMobile";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  finalized: boolean;
}


export default function MenuPage() {
  const { addItem } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [hasPreviousOrder, setHasPreviousOrder] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate(); 

  const fetchItems = async () => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      toast.error("You must be logged in to view the menu.");
      navigate("/login"); 
      return;
    }

    try {
      const res = await axios.get("https://serenity-gardens.onrender.com/api/items", {
        headers: { Authorization: `Bearer ${token}` } 
      });
      setProducts(res.data.filter((item: Product) => item.finalized));
    } catch (err) {
      console.error("Failed to fetch items:", err);
      toast.error("Failed to fetch items. Please log in again.");
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        logout();
      }
    }
  };

  
  useEffect(() => {
    fetchItems();
    checkPreviousOrder();
  }, []);

  const checkPreviousOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("https://serenity-gardens.onrender.com/api/orders/my-latest", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) setHasPreviousOrder(true);
    } catch (err) {
      setHasPreviousOrder(false); 
    }
  };

  const handleRepeatOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("https://serenity-gardens.onrender.com/api/orders/my-latest", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const previousItems = res.data.items;
      type OrderItem = {
        id: string;
        productId?: string;
        name: string;
        price: number;
        quantity: number;
      };
      previousItems.forEach((item: OrderItem) => {
        const productDetails = products.find(p => p._id === (item.productId || item.id));
        
        if (productDetails) {
          addItem({
            id: productDetails._id, 
            name: productDetails.name,
            price: productDetails.price, 
            quantity: item.quantity,
            stock: productDetails.stock,
            image: productDetails.image
          });
        } else {
          console.warn(`Product ${item.name} not found in current catalogue.`);
        }
      });

      toast.success("Previous order added to cart!");
    } catch (err) {
      toast.error("Could not repeat previous order.");
    }
  };
  

  const handleAddToCart = (product: Product) => {
    const quantity = parseInt(
      prompt(`Enter quantity (Available: ${product.stock})`) || "0",
      10
    );

    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Please enter a valid quantity!");
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available.`);
      return;
    }

    const item: CartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      stock: product.stock,
      image: product.image,
    };

    addItem(item);
    toast.success(`${product.name} added to cart!`); 
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${isMobile ? "overflow-x-hidden" : ""}`}>
      <Button
        className="fixed bottom-4 left-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
        onClick={logout}
      >
        Logout
      </Button>
      
      
      
      <div className="w-full px-1 md:px-12 flex items-center justify-start">
          <AuroraText className={`${isMobile ? "text-3xl" : "text-3xl md:text-5xl"} mb-10 font-bold text-left`}>
            Shop Catalogue For This Week
          </AuroraText>          
      </div>
      {hasPreviousOrder && (
        <Button
          className="mb-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          onClick={handleRepeatOrder}
        >
          Repeat Last Order
        </Button>
      )}
      <div className={`grid ${isMobile ? "grid-cols-1 gap-4 px-2" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6"} w-full mb-10max-w-6xl`}>
        {products.map((product) => (
          <div
            key={product._id}
            data-ignore-outside-click
            className={`bg-white ${isMobile ? "w-full h-[320px]" : "w-[250px] h-[340px]"} dark:bg-neutral-900 p-4 rounded-lg shadow-md hover:shadow-lg transition`}
          >
            <div data-ignore-outside-click>
              {product.image && (
                <img
                  src={product.image || "https://res.cloudinary.com/drj7t97rd/image/upload/f_auto,q_auto/v1748499034/placeholder-images-image_large_pnwitd.webp"}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h2 className="text-xl font-semibold text-black dark:text-white">
                {product.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                ₹{product.price}
              </p>
              <p className="text-sm text-gray-400 mb-2">Stock: {product.stock}</p>
              <Button className="w-full" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}