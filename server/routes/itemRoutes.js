import express from "express";
import Item from "../models/Item.js";
import multer from 'multer';
const router = express.Router();
const storage = multer.memoryStorage(); // You can later switch to disk or cloud (e.g., Cloudinary)
const upload = multer({ storage });
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
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    const imageBuffer = req.file ? req.file.buffer.toString("base64") : null;
    const imageMimeType = req.file?.mimetype;

    const item = new Item({
      name,
      description,
      price,
      stock,
      image: imageBuffer ? `data:${imageMimeType};base64,${imageBuffer}` : null,
    });

    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/finalize/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { finalized: true }, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// itemRoutes.js
router.get("/", async (req, res) => {
  try {
    const items = await Item.find({ finalized: true });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching items" });
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
