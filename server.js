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
    "Wellness",
    "Kids",
    "Gaming",
    "Pet Care",
    "Stationery",
    "Footwear",
    "Accessories",
    "Outdoor",
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
    {
      title: "Green Living Picks",
      subtitle: "Sustainable home essentials under $49",
      cta: "Go eco",
    },
    {
      title: "Weekend Sports Gear",
      subtitle: "Bundle offers for outdoor lovers",
      cta: "Gear up",
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
    {
      id: 9,
      name: "PulseFit Smartwatch",
      price: "$149",
      rating: 4.6,
      badge: "New",
      tag: "Health tracking",
    },
    {
      id: 10,
      name: "AuraGlow Desk Lamp",
      price: "$59",
      rating: 4.4,
      badge: "Deal",
      tag: "Smart dimming",
    },
    {
      id: 11,
      name: "EcoFresh Grocery Box",
      price: "$39",
      rating: 4.3,
      badge: "Save",
      tag: "Weekly subscription",
    },
    {
      id: 12,
      name: "TrailBlaze Backpack",
      price: "$99",
      rating: 4.5,
      badge: "Top",
      tag: "Weatherproof",
    },
    {
      id: 13,
      name: "ZenMist Aroma Diffuser",
      price: "$69",
      rating: 4.7,
      badge: "Calm",
      tag: "Essential oils",
    },
    {
      id: 14,
      name: "FlexiCook Air Fryer",
      price: "$129",
      rating: 4.6,
      badge: "Hot",
      tag: "Smart presets",
    },
    {
      id: 15,
      name: "LunaSoft Bedding Set",
      price: "$119",
      rating: 4.8,
      badge: "Best",
      tag: "Cooling fabric",
    },
    {
      id: 16,
      name: "Vertex Gaming Chair",
      price: "$229",
      rating: 4.5,
      badge: "Pick",
      tag: "Ergonomic",
    },
  ],
  brands: [
    "Lumen",
    "Apex",
    "Everlane",
    "Viora",
    "Nordic",
    "Zephyr",
    "Vista",
    "Orbit",
    "Halo",
    "Maven",
    "Ridge",
    "Opal",
  ],
  services: [
    "Same-day delivery",
    "30-day returns",
    "Verified sellers",
    "Smart recommendations",
    "Secure payments",
    "Installment plans",
    "Gift wrapping",
    "Instant chat support",
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
    { title: "Pet-friendly picks", desc: "Comfort items and smart tech for furry friends." },
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
    {
      q: "How do I become a seller?",
      a: "Apply in the Seller Hub and complete verification in under 48 hours.",
    },
  ],
  badges: [
    "ISO-certified logistics",
    "24/7 fraud monitoring",
    "Trusted by 2,500+ sellers",
    "4.8 average rating",
  ],
  timeline: [
    { title: "Order placed", note: "Instant confirmation and payment verification." },
    { title: "Seller dispatch", note: "Packed within 4 hours with secure seal." },
    { title: "On the move", note: "Live tracking across 15+ courier partners." },
    { title: "Delivered", note: "OTP-secured delivery with feedback prompts." },
  ],
  appStats: [
    { label: "App downloads", value: "12M+" },
    { label: "Daily active users", value: "640K" },
    { label: "Avg. basket size", value: "$74" },
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
