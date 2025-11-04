// ✅ qrTestServer.js
import express from "express";
import cors from "cors";
import QRCode from "qrcode";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./authRoutes.js"; // all your /api/auth routes

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve frontend folder statically
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Default route – open login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// ✅ Auth routes
app.use("/api/auth", authRoutes);

// ✅ QR Generation route
app.post("/api/qr/generate", async (req, res) => {
  try {
    const { courseCode } = req.body;
    if (!courseCode) {
      return res.status(400).json({ message: "Course code required" });
    }

    const qrData = `${courseCode}_${Date.now()}`;
    const qr = await QRCode.toDataURL(qrData);

    console.log("✅ QR generated for:", courseCode);
    res.json({ qr, qrData, message: "QR successfully generated" });
  } catch (err) {
    console.error("❌ Error generating QR:", err);
    res.status(500).json({ message: "Error generating QR" });
  }
});

// ✅ Server start (only once!)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
