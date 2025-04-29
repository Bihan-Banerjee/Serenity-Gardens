"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ItemManager = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", price: "", stock: "" });
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

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/items", form);
      toast.success("Item added!");
      setForm({ title: "", price: "", stock: "" });
      fetchItems();
    } catch (err) {
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
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded text-black"
          required
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
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Item
        </button>
      </form>

      {/* List of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item._id} className="p-4 border rounded flex flex-col">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p>Price: ₹{item.price}</p>
            {editingStockId === item._id ? (
              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="border p-1 rounded w-20"
                />
                <button
                  onClick={() => handleStockUpdate(item._id)}
                  className="bg-green-500 text-white px-2 rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="mt-2">
                Stock: {item.stock}{" "}
                <button
                  onClick={() => { setEditingStockId(item._id); setNewStock(item.stock); }}
                  className="text-blue-500 underline text-sm ml-2"
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemManager;
