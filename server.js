const express = require("express");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({
      message: "Please provide email, password, and role.",
    });
  }

  const welcomeMessage =
    role === "admin"
      ? "Welcome back, admin. Redirecting to your dashboard."
      : "Welcome back! Loading your personalized storefront.";

  return res.json({
    message: welcomeMessage,
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`AgriMarket server running on http://127.0.0.1:${PORT}`);
});
