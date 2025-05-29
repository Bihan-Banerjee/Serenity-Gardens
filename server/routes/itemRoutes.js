import express from "express";
import Item from "../models/Item.js";
import multer from "multer";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();


router.post("/", upload.single("image"), async (req, res) => {
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
      imageUrl = result.secure_url || "https://res.cloudinary.com/drj7t97rd/image/upload/v1748499034/placeholder-images-image_large_pnwitd.webp";;
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

router.patch('/finalize/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { finalized: true }, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Admin Panel should use this
router.get("/all", async (req, res) => {
  try {
    const items = await Item.find(); // No filter
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching items" });
  }
});

// ✅ Shop page should use this
router.get("/", async (req, res) => {
  try {
    const items = await Item.find({ finalized: true });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching finalized items" });
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
