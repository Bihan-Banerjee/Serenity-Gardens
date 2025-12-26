import express from "express";
import Item from "../models/Item.js";
import multer from "multer";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import { protect, adminProtect } from "../middleware/auth.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post("/", protect, adminProtect, upload.single("image"), async (req, res) => {
  try {
    const { name, price, stock, description } = req.body;
    if (!name || !price || !stock) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let imageUrl = "";
    if (req.file) {
      const buffer = await sharp(req.file.buffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toBuffer();

      const uploadFromBuffer = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "serenity-items" },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                return reject(error);
              }
              resolve(result);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      const result = await uploadFromBuffer(buffer);
      imageUrl = result.secure_url || "https://res.cloudinary.com/drj7t97rd/image/upload/v1748499034/placeholder-images-image_large_pnwitd.webp";
    }

    const item = new Item({
      name,
      price: Number(price),
      stock: Number(stock),
      description,
      image: imageUrl,
      finalized: false,
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("Add item failed:", err);
    res.status(500).json({ message: "Failed to upload item", error: err.message });
  }
});

router.patch('/finalize/:id', protect, adminProtect, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id, 
      { finalized: true }, 
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/all", protect, adminProtect, async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching items" });
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await Item.find({ finalized: true });
    res.json(items);
  } catch (err) {
    console.error("Error fetching finalized items:", err);
    res.status(500).json({ message: "Error fetching finalized items" });
  }
});

router.patch("/:id", protect, adminProtect, async (req, res) => {
  try {
    const { stock, price } = req.body;
    const updateData = {};
    if (stock !== undefined) updateData.stock = Number(stock);
    if (price !== undefined) updateData.price = Number(price);
    
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) return res.status(404).json({ message: "Item not found" });
    
    console.log('Updated item:', updatedItem);
    res.json(updatedItem);
  } catch (err) {
    console.error('Update error:', err);
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", protect, adminProtect, async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
