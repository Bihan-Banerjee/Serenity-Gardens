"use client";

import { useCartStore } from "./useCartStore";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MenuPage() {
  const { addItem } = useCartStore();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/items");
        setProducts(res.data.filter((item) => item.finalized));
      } catch (err) {
        console.error("Failed to fetch items");
      }
    };

    fetchItems();
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

    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div data-ignore-outside-click className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {products.map((product) => (
          <div
            key={product._id}
            data-ignore-outside-click
            className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div data-ignore-outside-click>
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
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
              <Button onClick={() => handleAddToCart(product)}>
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
