"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/items");
        setProducts(res.data.filter(item => item.finalized));

      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const quantity = parseInt(
      prompt(`Enter quantity (Available: ${product.stock})`) || "0",
      10
    );

    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity!");
      return;
    }

    if (quantity > product.stock) {
      alert(`Only ${product.stock} items available.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start mt-32 px-4">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-6xl mb-8 px-4">
        <div className="flex items-center space-x-4">
          <img src="/logo.jpg" alt="Logo" className="w-12 h-12 rounded-full" />
          <h1 className="text-3xl font-bold">Serenity Gardens Shop</h1>
        </div>
        <div className="text-right">
          <p className="font-semibold">🛒 Items: {totalItems}</p>
          <p className="font-semibold">💵 Total: ₹{totalPrice}</p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md hover:shadow-xl transition"
          >
            <img
              src={product.image || "fallback.jpg"}
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-bold text-black">{product.name}</h2>
            <p className="text-gray-500">₹{product.price}</p>
            <p className="text-gray-400 mb-4">Stock: {product.stock}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
