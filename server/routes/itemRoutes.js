import express from "express";
import Item from "../models/Item.js";
import multer from "multer";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });
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
router.post("/", upload.single("image"), async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const buffer = await sharp(req.file.buffer)
        .resize(800) // Resize if needed
        .jpeg({ quality: 80 })
        .toBuffer();

      const result = await cloudinary.uploader.upload_stream(
        { folder: "serenity-items" },
        (error, result) => {
          if (error) throw error;
          imageUrl = result.secure_url;
          finalize();
        }
      );

      // Pipe buffer into Cloudinary stream
      streamifier.createReadStream(buffer).pipe(result);
    } else {
      finalize();
    }

    async function finalize() {
      const item = new Item({
        name,
        price,
        stock,
        description,
        image: imageUrl,
      });

      await item.save();
      res.status(201).json(item);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload item" });
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
