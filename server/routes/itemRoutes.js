import express from "express";
import Item from "../models/Item.js";

const router = express.Router();

// Fetch all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new item
router.post("/", async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    if (!name || !price || stock == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newItem = new Item({ name, description, price, stock });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update stock of item
router.patch("/:id", async (req, res) => {
  try {
    const { stock } = req.body;
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ message: "Item not found" });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an item
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
