const { useState } = React;

const App = () => {
  const [adminStatus, setAdminStatus] = useState("");
  const [userStatus, setUserStatus] = useState("");

  const handleLogin = async (event, role) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const statusSetter = role === "admin" ? setAdminStatus : setUserStatus;
    statusSetter("Signing in...");

    try {
      const response = await fetch(`/api/login/${role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        statusSetter(data.message || "Login failed.");
        return;
      }
      statusSetter(data.message || "Login successful.");
    } catch (error) {
      statusSetter("Server unavailable. Please try again.");
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="brand">
          <span className="logo">🛍️</span>
          <div>
            <h1>ShopSphere</h1>
            <p>Full-stack shopping experience with admin control and user access.</p>
          </div>
        </div>
        <nav>
          <a href="#collections">Collections</a>
          <a href="#platform">Platform</a>
          <a href="#logins">Login</a>
          <button className="cta">Start Shopping</button>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="pill">Full-stack ready</span>
            <h2>Design your next shopping experience.</h2>
            <p>
              Discover curated collections, fast checkout, and personalized recommendations for every
              shopper. Built for customers and admins alike with a live API.
            </p>
            <div className="hero-actions">
              <button className="cta">Browse Products</button>
              <button className="ghost">See Platform</button>
            </div>
            <div className="stats">
              <div>
                <strong>40K+</strong>
                <span>Active shoppers</span>
              </div>
              <div>
                <strong>2.5K</strong>
                <span>Verified sellers</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Support</span>
              </div>
            </div>
          </div>
          <div className="hero-card">
            <h3>Trending bundles</h3>
            <ul>
              <li>
                <span>Smart home starter kit</span>
                <strong>$249</strong>
              </li>
              <li>
                <span>Eco essentials</span>
                <strong>$89</strong>
              </li>
              <li>
                <span>Streetwear favorites</span>
                <strong>$129</strong>
              </li>
            </ul>
            <button className="cta full">View all bundles</button>
          </div>
        </section>

        <section id="collections" className="collections">
          <h2>Collections for every shopper</h2>
          <p>Curated experiences that scale from indie stores to multi-brand marketplaces.</p>
          <div className="collection-grid">
            <article>
              <h3>Fashion & Lifestyle</h3>
              <p>Drop-based merchandising, style boards, and influencer-ready lookbooks.</p>
            </article>
            <article>
              <h3>Tech & Gadgets</h3>
              <p>Warranty management, device protection, and real-time inventory alerts.</p>
            </article>
            <article>
              <h3>Home & Living</h3>
              <p>Room bundles, AR previews, and guided decor inspirations.</p>
            </article>
            <article>
              <h3>Beauty & Wellness</h3>
              <p>Subscription plans, refill reminders, and ingredient transparency.</p>
            </article>
          </div>
        </section>

        <section id="platform" className="benefits">
          <div>
            <h2>Why teams choose ShopSphere</h2>
            <ul>
              <li>Unified dashboard for orders, inventory, and customer insights.</li>
              <li>Secure payments with fraud monitoring and instant payouts.</li>
              <li>Automations for refunds, notifications, and loyalty rewards.</li>
            </ul>
          </div>
          <div className="benefit-card">
            <h3>Operational highlights</h3>
            <div className="tag">Admin ready</div>
            <p>Assign roles, approve new products, and track KPIs with real-time reporting.</p>
            <div className="tag">Customer first</div>
            <p>Saved carts, multi-address checkout, and smart recommendations.</p>
          </div>
        </section>

        <section id="logins" className="logins">
          <div className="login-card">
            <h2>Admin Login</h2>
            <p>Manage products, orders, and storefront analytics.</p>
            <form onSubmit={(event) => handleLogin(event, "admin")}>
              <label>
                Email
                <input name="email" type="email" placeholder="admin@shopsphere.com" required />
              </label>
              <label>
                Password
                <input name="password" type="password" placeholder="Enter your password" required />
              </label>
              <button className="cta full" type="submit">Sign in as Admin</button>
              <span className="helper">
                {adminStatus || "Demo admin: admin@shopsphere.com / admin123"}
              </span>
            </form>
          </div>
          <div className="login-card alt">
            <h2>User Login</h2>
            <p>Track your orders, manage wishlists, and redeem rewards.</p>
            <form onSubmit={(event) => handleLogin(event, "user")}>
              <label>
                Email
                <input name="email" type="email" placeholder="you@email.com" required />
              </label>
              <label>
                Password
                <input name="password" type="password" placeholder="Enter your password" required />
              </label>
              <button className="cta full" type="submit">Sign in as User</button>
              <span className="helper">
                {userStatus || "Demo user: user@shopsphere.com / user1234"}
              </span>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div>
          <h3>ShopSphere</h3>
          <p>Built for modern shopping experiences with secure admin and user access.</p>
        </div>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </footer>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
