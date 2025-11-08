import express from "express";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = "qr_secret_key";
const DB_PATH = "./data.json";

app.use(cors());
app.use(bodyParser.json());
app.get("/auth/test", (req, res) => res.send("Backend is working!"));


// Helper functions
function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], attendance: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// --- Routes ---

// Register
app.post("/auth/register", (req, res) => {
  const { name, matNo, password, role } = req.body;
  if (!name || !matNo || !password || !role)
    return res.status(400).json({ message: "All fields are required" });

  const db = readDB();
  if (db.users.find((u) => u.matNo === matNo))
    return res.status(400).json({ message: "Matric number already exists" });

  db.users.push({ name, matNo, password, role });
  writeDB(db);
  res.json({ message: "User registered successfully" });
});

// Login
app.post("/auth/login", (req, res) => {
  const { matNo, password } = req.body;
  const db = readDB();
  const user = db.users.find((u) => u.matNo === matNo && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ matNo: user.matNo, role: user.role }, SECRET, { expiresIn: "2h" });
  res.json({ message: "Login successful", token, role: user.role });
});

// Record attendance
app.post("/attendance", (req, res) => {
  const { matNo, course, timestamp } = req.body;
  const db = readDB();
  db.attendance.push({ matNo, course, timestamp: timestamp || new Date().toISOString() });
  writeDB(db);
  res.json({ message: "Attendance recorded successfully" });
});

// Get attendance list
app.get("/attendance", (req, res) => {
  const db = readDB();
  res.json(db.attendance);
});
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
