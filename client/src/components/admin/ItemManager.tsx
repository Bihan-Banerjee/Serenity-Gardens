"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ItemManager = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", image: null });
  const [editingStockId, setEditingStockId] = useState(null);
  const [newStock, setNewStock] = useState("");

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/items");
      setItems(res.data);
    } catch (err) {
      toast.error("Error fetching items");
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    if (form.image) formData.append("image", form.image);

    try {
      await axios.post("http://localhost:5000/api/items", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Item added!");
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: null,
      });
      fetchItems();
    } catch {
      toast.error("Error adding item");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      toast.success("Item deleted!");
      fetchItems();
    } catch (err) {
      toast.error("Error deleting item");
    }
  };

  const handleFinalize = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/items/finalize/${id}`);
      toast.success("Item finalized!");
      fetchItems();
    } catch (err) {
      toast.error("Error finalizing item");
    }
  };
  

  const handleStockUpdate = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/items/${id}`, { stock: newStock });
      toast.success("Stock updated!");
      setEditingStockId(null);
      fetchItems();
    } catch (err) {
      toast.error("Error updating stock");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="space-y-6">
      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="space-y-4">
      <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border rounded text-black"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded text-black"
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full p-2 border rounded text-black"
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="w-full p-2 border rounded text-black"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm({ ...form, image: e.target.files?.[0] || null })
          }
          className="w-full p-2 border rounded text-black"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Item
        </button>
      </form>

       {/* ✅ Items Display */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="p-2 border rounded flex flex-col bg-white dark:bg-neutral-800 max-w-xs mx-autoshadow-lg"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h3 className="text-lg text-gray-800 font-bold">{item.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{item.description}</p>
            <p className="text-sm text-gray-600">Price: ₹{item.price}</p>

            {editingStockId === item._id ? (
              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="border p-1 rounded w-20 text-black"
                />
                <button
                  onClick={() => handleStockUpdate(item._id)}
                  className="bg-green-500 text-black px-2 rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-600">
                Stock: {item.stock}{" "}
                <button
                  onClick={() => {
                    setEditingStockId(item._id);
                    setNewStock(item.stock);
                  }}
                  className="text-white text-sm ml-2"
                >
                  Edit
                </button>
              </p>
            )}
            <button
              onClick={() => handleDelete(item._id)}
              className="mt-4 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => handleFinalize(item._id)}
              className="mt-2 bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
            >
              Finalize
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemManager;