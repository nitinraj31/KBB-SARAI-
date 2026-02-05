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

const catalog = {
  categories: [
    "Mobiles",
    "Fashion",
    "Electronics",
    "Home",
    "Beauty",
    "Sports",
    "Grocery",
    "Books",
    "Toys",
    "Appliances",
    "Furniture",
    "Travel",
  ],
  promos: [
    {
      title: "Mega Electronics Week",
      subtitle: "Up to 60% off + instant bank offers",
      cta: "Shop electronics",
    },
    {
      title: "Style Studio",
      subtitle: "Fresh fits curated daily",
      cta: "Explore fashion",
    },
    {
      title: "Home Refresh",
      subtitle: "Upgrade every corner",
      cta: "See home deals",
    },
  ],
  products: [
    {
      id: 1,
      name: "Nova X1 5G Phone",
      price: "$499",
      rating: 4.7,
      badge: "Hot",
      tag: "Free delivery",
    },
    {
      id: 2,
      name: "Aurora Noise Cancelling Headphones",
      price: "$199",
      rating: 4.6,
      badge: "New",
      tag: "2-year warranty",
    },
    {
      id: 3,
      name: "CloudSoft Sofa",
      price: "$899",
      rating: 4.4,
      badge: "Top",
      tag: "Easy EMI",
    },
    {
      id: 4,
      name: "Athletica Running Shoes",
      price: "$129",
      rating: 4.5,
      badge: "Trending",
      tag: "Extra 10% off",
    },
    {
      id: 5,
      name: "ChefPro Blender",
      price: "$149",
      rating: 4.2,
      badge: "Deal",
      tag: "Kitchen favorite",
    },
    {
      id: 6,
      name: "GlowSkin Care Set",
      price: "$89",
      rating: 4.8,
      badge: "Best",
      tag: "Derm-approved",
    },
    {
      id: 7,
      name: "SmartAir Purifier",
      price: "$259",
      rating: 4.3,
      badge: "Eco",
      tag: "Low noise",
    },
    {
      id: 8,
      name: "Voyager Cabin Bag",
      price: "$179",
      rating: 4.5,
      badge: "Pick",
      tag: "Lifetime care",
    },
  ],
  brands: ["Lumen", "Apex", "Everlane", "Viora", "Nordic", "Zephyr", "Vista", "Orbit"],
  services: [
    "Same-day delivery",
    "30-day returns",
    "Verified sellers",
    "Smart recommendations",
    "Secure payments",
    "Installment plans",
  ],
  insights: [
    { label: "Orders processed", value: "1.2M", note: "Last 30 days" },
    { label: "Avg. delivery time", value: "28 hrs", note: "Metro cities" },
    { label: "Customer satisfaction", value: "4.8/5", note: "Live ratings" },
  ],
  stories: [
    { title: "Campus essentials", desc: "Backpacks, notebooks, and smart gear for students." },
    { title: "Weekend getaway", desc: "Travel kits, wearables, and compact luggage." },
    { title: "Wellness reset", desc: "Home gym, supplements, and recovery tools." },
  ],
  faqs: [
    {
      q: "How do refunds work?",
      a: "Refunds are initiated instantly after pickup and settled within 3-5 business days.",
    },
    {
      q: "Can sellers manage inventory?",
      a: "Yes. Admins can onboard sellers with role-based inventory dashboards.",
    },
    {
      q: "Do you support EMI?",
      a: "Flexible EMI plans are available on selected categories with zero-cost options.",
    },
  ],
};

app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/api/catalog", (_req, res) => {
  res.json(catalog);
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
