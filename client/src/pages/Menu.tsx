"use client";

import { useState } from "react";

// Dummy shop data
const products = [
  { id: 1, name: "Cabbage", price: 100, stock: 10, img: "images/cabbage.jpg" },
  { id: 2, name: "Tomato", price: 200, stock: 5, img: "images/tomato.jpg" },
  { id: 3, name: "Flower", price: 50, stock: 20, img: "images/bigFlower.jpg" },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Shop() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (product: typeof products[0]) => {
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

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
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

        <div className="flex flex-col text-right">
          <p className="font-semibold text-lg">🛒 Items: {totalItems}</p>
          <p className="font-semibold text-lg">💵 Total: ₹{totalPrice}</p>
        </div>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:shadow-xl transition"
          >
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2 text-black">{product.name}</h2>
            <p className="text-gray-500 mb-2">₹{product.price}</p>
            <p className="text-gray-400 mb-4">Stock: {product.stock}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
