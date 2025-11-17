// backend/routes/admin.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

// Register (optional — first admin)
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ error: "Admin already exists" });
    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, password: hash });
    return res.json({ success: true, adminId: admin._id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ email: admin.email, id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ success: true, token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
