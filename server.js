const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopsphere";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

const ensureDefaultUsers = async () => {
  const defaults = [
    { email: "admin@shopsphere.com", password: "admin123", role: "admin" },
    { email: "user@shopsphere.com", password: "user1234", role: "user" },
  ];

  for (const account of defaults) {
    await User.findOneAndUpdate(
      { email: account.email },
      { $setOnInsert: account },
      { upsert: true, new: true }
    );
  }
};

const loginHandler = async (req, res, role) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "Email and password are required." });
  }

  const user = await User.findOne({ email, role });
  if (!user || user.password !== password) {
    return res.status(401).json({ ok: false, message: "Invalid credentials." });
  }

  return res.json({ ok: true, role, message: `Welcome back, ${user.email}!` });
};

app.post("/api/login/admin", async (req, res) => {
  try {
    await loginHandler(req, res, "admin");
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

app.post("/api/login/user", async (req, res) => {
  try {
    await loginHandler(req, res, "user");
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error." });
  }
});

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    await ensureDefaultUsers();
    app.listen(PORT, () => {
      console.log(`ShopSphere server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
  });
