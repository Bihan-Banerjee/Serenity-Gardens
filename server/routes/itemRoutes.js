import express from "express";
import Item from "../models/Item.js";
import multer from "multer";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import { protect, adminProtect } from "../middleware/auth.js";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  },
});
const router = express.Router();

const uploadImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

router.post("/", protect, adminProtect, uploadImage, async (req, res) => {
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
    res.status(500).json({ message: "Failed to upload item" });
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
    console.error("Failed to finalize item:", err);
    res.status(500).json({ message: "Failed to finalize item" });
  }
});

router.get("/all", protect, adminProtect, async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
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

    if (stock !== undefined) {
      const parsedStock = Number(stock);
      if (!Number.isInteger(parsedStock) || parsedStock < 0) {
        return res.status(400).json({ message: "Stock must be a whole number" });
      }
      updateData.stock = parsedStock;
    }

    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ message: "Price must be a positive number" });
      }
      updateData.price = parsedPrice;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedItem) return res.status(404).json({ message: "Item not found" });

    res.json(updatedItem);
  } catch (err) {
    console.error("Failed to update item:", err);
    res.status(400).json({ message: "Failed to update item" });
  }
});

router.delete("/:id", protect, adminProtect, async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("Failed to delete item:", err);
    res.status(400).json({ message: "Failed to delete item" });
  }
});

export default router;
