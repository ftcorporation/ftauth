const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// License Schema
const LicenseSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  validUntil: { type: Date, required: true },
});

const License = mongoose.model("License", LicenseSchema);

// Generate License
router.post("/generate", async (req, res) => {
  try {
    const { userId, days } = req.body;

    if (!userId || !days)
      return res.status(400).json({ message: "User ID and days are required" });

    const key = Math.random().toString(36).substring(2, 12).toUpperCase();
    const validUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const license = new License({ key, userId, validUntil });
    await license.save();

    res.status(201).json({ key, validUntil });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// Verify License (used by EXE)
router.post("/verify", async (req, res) => {
  try {
    const { key } = req.body;
    if (!key)
      return res
        .status(400)
        .json({ valid: false, message: "License key required" });

    const license = await License.findOne({ key });
    if (!license)
      return res
        .status(400)
        .json({ valid: false, message: "License not found" });

    if (license.validUntil < new Date())
      return res.status(400).json({ valid: false, message: "License expired" });

    res.status(200).json({ valid: true, validUntil: license.validUntil });
  } catch (err) {
    console.error(err);
    res.status(500).json({ valid: false, message: "Server error" });
  }
});

module.exports = router;
