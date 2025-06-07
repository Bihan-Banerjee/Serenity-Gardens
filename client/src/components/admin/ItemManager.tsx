"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

type Item = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
};

type ItemForm = {
  name: string;
  description: string;
  price: string;
  stock: string;
  image: File | null;
};

const ItemManager = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<ItemForm>({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [newStock, setNewStock] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchItems = async () => {
    try {
      const res = await axios.get("https://serenity-gardens.onrender.com/api/items/all");
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
      await axios.post("https://serenity-gardens.onrender.com/api/items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Item added!");
      setForm({ name: "", description: "", price: "", stock: "", image: null });
      fetchItems();
    } catch {
      toast.error("Error adding item");
    }
  };

  const handleDelete = async (id:string) => {
    try {
      await axios.delete(`https://serenity-gardens.onrender.com/api/items/${id}`);
      toast.success("Item deleted!");
      fetchItems();
    } catch {
      toast.error("Error deleting item");
    }
  };

  const handleFinalize = async (id:string) => {
    try {
      await axios.patch(`https://serenity-gardens.onrender.com/api/items/finalize/${id}`);
      toast.success("Item finalized!");
      fetchItems();
    } catch {
      toast.error("Error finalizing item");
    }
  };

  const handleStockUpdate = async (id:string) => {
    try {
      await axios.patch(`https://serenity-gardens.onrender.com/api/items/${id}`, { stock: newStock });
      toast.success("Stock updated!");
      setEditingStockId(null);
      fetchItems();
    } catch {
      toast.error("Error updating stock");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIdx, startIdx + itemsPerPage);

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="space-y-6">
      {/*Add Item Form */}
      <form onSubmit={handleAddItem} className="space-y-4">
        <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded text-black" required />
        <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-2 border rounded text-black" />
        <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full p-2 border rounded text-black" required />
        <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full p-2 border rounded text-black" required />
        <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} className="w-full p-2 border rounded text-black" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Item</button>
      </form>

      {/*Items Display (Paginated) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentItems.map((item) => (
          <div key={item._id} className="h-[450px] w-[200px] p-2 border rounded flex flex-col bg-white dark:bg-neutral-800 max-w-xs mx-auto shadow-lg">
            {item.image && (
              <img src={item.image || "https://res.cloudinary.com/drj7t97rd/image/upload/v1748499034/placeholder-images-image_large_pnwitd.webp"} loading="lazy" alt={item.name} className="w-full h-48 object-cover rounded mb-4" />
            )}
            <h3 className="text-lg text-gray-800 font-bold">{item.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{item.description}</p>
            <p className="text-sm text-gray-600">Price: ₹{item.price}</p>

            {editingStockId === item._id ? (
              <div className="flex gap-2 mt-2">
                <input type="number" value={newStock} onChange={(e) => setNewStock(e.target.value)} className="border p-1 rounded w-20 text-black" />
                <button onClick={() => handleStockUpdate(item._id)} className="bg-green-500 text-white px-2 rounded">Save</button>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-600">
                Stock: {item.stock}
                <button onClick={() => { setEditingStockId(item._id); setNewStock(String(item.stock)); }} className="text-white text-sm ml-2">Edit</button>
              </p>
            )}

            <button onClick={() => handleDelete(item._id)} className="mt-4 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">Delete</button>
            <button onClick={() => handleFinalize(item._id)} className="mt-2 bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700">Finalize</button>
          </div>
        ))}
      </div>

      {/*Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white dark:text-white"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-neutral-700 text-white dark:text-white"}`}
            onClick={() => goToPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white dark:text-white"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ItemManager;
