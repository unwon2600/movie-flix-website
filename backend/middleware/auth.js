// backend/middleware/auth.js
import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const auth = req.headers.authorization || "";
  if (!auth) return res.status(401).json({ msg: "No authorization header" });

  // expect format: "Bearer <token>"
  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ msg: "Invalid authorization format. Use: Bearer <token>" });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
}
