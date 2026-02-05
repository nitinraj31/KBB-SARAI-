const { useEffect, useMemo, useState } = React;

const fallbackCatalog = {
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
    {
      label: "Orders processed",
      value: "1.2M",
      note: "Last 30 days",
    },
    {
      label: "Avg. delivery time",
      value: "28 hrs",
      note: "Metro cities",
    },
    {
      label: "Customer satisfaction",
      value: "4.8/5",
      note: "Live ratings",
    },
  ],
  stories: [
    {
      title: "Campus essentials",
      desc: "Backpacks, notebooks, and smart gear for students.",
    },
    {
      title: "Weekend getaway",
      desc: "Travel kits, wearables, and compact luggage.",
    },
    {
      title: "Wellness reset",
      desc: "Home gym, supplements, and recovery tools.",
    },
    {
      title: "Pet-friendly picks",
      desc: "Comfort items and smart tech for furry friends.",
    },
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

const App = () => {
  const [adminStatus, setAdminStatus] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [catalog, setCatalog] = useState(fallbackCatalog);
  const [searchValue, setSearchValue] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [deliveryStatus, setDeliveryStatus] = useState("");

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch("/api/catalog");
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        setCatalog(data);
      } catch (error) {
        // fallback already set
      }
    };

    fetchCatalog();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchValue) {
      return catalog.products;
    }
    const normalized = searchValue.toLowerCase();
    return catalog.products.filter((product) =>
      product.name.toLowerCase().includes(normalized)
    );
  }, [catalog.products, searchValue]);

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

  const handleAddToCart = () => {
    setCartCount((count) => count + 1);
  };

  const handleWishlist = () => {
    setWishlistCount((count) => count + 1);
  };

  const handleEstimate = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const pincode = formData.get("pincode");
    if (!pincode) {
      setDeliveryStatus("Enter a valid pin code.");
      return;
    }
    setDeliveryStatus(`Estimated delivery: 2-4 days for ${pincode}.`);
  };

  return (
    <>
      <header className="site-header">
        <div className="brand">
          <span className="logo">🛍️</span>
          <div>
            <h1>ShopSphere</h1>
            <p>Full-stack shopping with admin and user control.</p>
          </div>
        </div>
        <div className="nav-shell">
          <div className="search-bar">
            <input
              type="search"
              placeholder="Search for products, brands, and more..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
            <button className="cta">Search</button>
          </div>
          <nav>
            <a href="#collections">Collections</a>
            <a href="#deals">Deals</a>
            <a href="#seller">Seller Hub</a>
            <a href="#logins">Login</a>
          </nav>
        </div>
        <div className="header-actions">
          <div className="header-badges">
            <span>Cart · {cartCount}</span>
            <span>Wishlist · {wishlistCount}</span>
          </div>
          <button className="cta outline">Start Shopping</button>
        </div>
      </header>

      <section className="category-strip">
        {catalog.categories.map((category) => (
          <span key={category} className="chip">
            {category}
          </span>
        ))}
      </section>

      <main>
        <section className="home-hero">
          <div className="hero-message">
            <span className="pill">Home of smart shopping</span>
            <h2>Everything you need for a premium storefront, all in one place.</h2>
            <p>
              ShopSphere brings together curated catalogs, fast fulfillment, and flexible admin
              controls so you can run a multi-brand marketplace with confidence.
            </p>
            <div className="hero-actions">
              <button className="cta">Start shopping</button>
              <button className="ghost">View live demo</button>
            </div>
          </div>
          <div className="hero-stack">
            <div className="hero-mini-card">
              <h3>Instant deals</h3>
              <p>Limited-time drops and smart coupons for every category.</p>
            </div>
            <div className="hero-mini-card accent">
              <h3>Trusted delivery</h3>
              <p>Live shipment tracking with 24/7 support coverage.</p>
            </div>
            <div className="hero-mini-card">
              <h3>Admin analytics</h3>
              <p>Real-time performance dashboards for every seller.</p>
            </div>
          </div>
        </section>

        <section className="quick-stats">
          {catalog.appStats.map((stat) => (
            <article key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </section>

        <section className="trust-strip">
          {catalog.badges.map((badge) => (
            <span key={badge}>{badge}</span>
          ))}
        </section>

        <section className="hero">
          <div className="hero-copy">
            <span className="pill">Marketplace 2.0</span>
            <h2>Build a mega-storefront without looking like anyone else.</h2>
            <p>
              Powered by React + MongoDB, ShopSphere blends curated shopping, smart search, and admin
              tools into a fresh experience for modern commerce teams.
            </p>
            <div className="hero-actions">
              <button className="cta">Browse Products</button>
              <button className="ghost">See the platform</button>
            </div>
            <div className="stats">
              {catalog.insights.map((item) => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                  <small>{item.note}</small>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-card">
            <h3>Daily spotlight</h3>
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
            <div className="hero-tags">
              <span>Fast dispatch</span>
              <span>Verified sellers</span>
              <span>Easy returns</span>
            </div>
          </div>
        </section>

        <section id="collections" className="collections">
          <div className="section-heading">
            <div>
              <h2>Collections for every shopper</h2>
              <p>Curated experiences that scale from indie stores to multi-brand marketplaces.</p>
            </div>
            <button className="ghost">View all collections</button>
          </div>
          <div className="collection-grid">
            {catalog.stories.map((story) => (
              <article key={story.title}>
                <h3>{story.title}</h3>
                <p>{story.desc}</p>
                <button className="text-link">Explore</button>
              </article>
            ))}
            <article>
              <h3>Fashion & Lifestyle</h3>
              <p>Drop-based merchandising, style boards, and influencer-ready lookbooks.</p>
              <button className="text-link">Plan looks</button>
            </article>
            <article>
              <h3>Tech & Gadgets</h3>
              <p>Warranty management, device protection, and real-time inventory alerts.</p>
              <button className="text-link">Discover tech</button>
            </article>
            <article>
              <h3>Home & Living</h3>
              <p>Room bundles, AR previews, and guided decor inspirations.</p>
              <button className="text-link">Shop rooms</button>
            </article>
          </div>
        </section>

        <section id="deals" className="deal-grid">
          {catalog.promos.map((promo) => (
            <article key={promo.title}>
              <h3>{promo.title}</h3>
              <p>{promo.subtitle}</p>
              <button className="cta small">{promo.cta}</button>
            </article>
          ))}
        </section>

        <section className="products">
          <div className="section-heading">
            <div>
              <h2>Trending right now</h2>
              <p>Hand-picked bestsellers with smart pricing and quick delivery.</p>
            </div>
            <div className="filters">
              <button className="chip active">All</button>
              <button className="chip">New arrivals</button>
              <button className="chip">Top rated</button>
              <button className="chip">Budget picks</button>
            </div>
          </div>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-badge">{product.badge}</div>
                <h3>{product.name}</h3>
                <p className="price">{product.price}</p>
                <div className="meta">
                  <span>⭐ {product.rating}</span>
                  <span>{product.tag}</span>
                </div>
                <div className="product-actions">
                  <button className="cta small" type="button" onClick={handleAddToCart}>
                    Add to cart
                  </button>
                  <button className="ghost small" type="button" onClick={handleWishlist}>
                    Save
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="delivery-estimator">
          <div>
            <h2>Check delivery speed</h2>
            <p>Enter your pin code to see estimated delivery windows.</p>
          </div>
          <form className="estimator-form" onSubmit={handleEstimate}>
            <input name="pincode" type="text" placeholder="Enter pin code" />
            <button className="cta" type="submit">Estimate</button>
          </form>
          {deliveryStatus ? <span className="helper">{deliveryStatus}</span> : null}
        </section>

        <section className="delivery-timeline">
          <div>
            <h2>Delivery, simplified</h2>
            <p>From checkout to doorstep, every milestone is transparent.</p>
          </div>
          <div className="timeline-grid">
            {catalog.timeline.map((step) => (
              <article key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="testimonial-grid">
          <div>
            <h2>What shoppers love</h2>
            <p>Real stories from buyers, admins, and brand partners.</p>
          </div>
          <div className="testimonial-cards">
            <article>
              <p>“The personalization tools make our daily drops feel premium.”</p>
              <strong>Priya · Fashion lead</strong>
            </article>
            <article>
              <p>“Support tickets dropped 40% after switching to ShopSphere.”</p>
              <strong>Alex · Support manager</strong>
            </article>
            <article>
              <p>“Inventory alerts and dashboards keep us ahead of demand.”</p>
              <strong>Ravi · Operations</strong>
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
              <li>Personalized storefronts with A/B testing and SEO insights.</li>
              <li>Logistics partners and smart routing with delivery SLAs.</li>
            </ul>
          </div>
          <div className="benefit-card">
            <h3>Operational highlights</h3>
            <div className="tag">Admin ready</div>
            <p>Assign roles, approve new products, and track KPIs with real-time reporting.</p>
            <div className="tag">Customer first</div>
            <p>Saved carts, multi-address checkout, and smart recommendations.</p>
            <div className="tag">Seller tools</div>
            <p>Dedicated seller analytics, catalog syncing, and inventory forecasting.</p>
          </div>
        </section>

        <section className="app-callout">
          <div>
            <h2>ShopSphere App</h2>
            <p>
              Scan, compare, and buy on the go. Exclusive app-only drops every weekend.
            </p>
            <div className="app-stats">
              {catalog.appStats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="app-card">
            <h3>Fast checkout</h3>
            <p>Save addresses, track orders, and manage returns instantly.</p>
            <button className="cta small">Get the app</button>
          </div>
        </section>

        <section className="spotlight-grid">
          {catalog.promos.map((promo) => (
            <article key={promo.title}>
              <h3>{promo.title}</h3>
              <p>{promo.subtitle}</p>
              <button className="ghost small">{promo.cta}</button>
            </article>
          ))}
        </section>

        <section className="brand-strip">
          <div>
            <h2>Brands shoppers trust</h2>
            <p>Partnered with modern labels and flagship innovators.</p>
          </div>
          <div className="brand-grid">
            {catalog.brands.map((brand) => (
              <span key={brand}>{brand}</span>
            ))}
          </div>
        </section>

        <section className="service-grid">
          <div>
            <h2>Premium services built-in</h2>
            <p>Everything you need to convert and retain customers at scale.</p>
          </div>
          <div className="service-cards">
            {catalog.services.map((service) => (
              <article key={service}>
                <h3>{service}</h3>
                <p>Automated workflows and proactive alerts keep every order on track.</p>
              </article>
            ))}
          </div>
        </section>

        <section id="seller" className="seller-panel">
          <div>
            <h2>Seller & Admin Hub</h2>
            <p>
              Monitor sales, optimize pricing, and manage returns with a dedicated admin workspace.
            </p>
            <ul>
              <li>Role-based access for finance, catalog, and support teams.</li>
              <li>Live inventory sync and automated reorder alerts.</li>
              <li>Campaign scheduler for flash sales and festive launches.</li>
            </ul>
            <button className="cta">Open seller dashboard</button>
          </div>
          <div className="panel-card">
            <h3>Today’s ops snapshot</h3>
            <div className="panel-metrics">
              <div>
                <strong>12,480</strong>
                <span>Orders in queue</span>
              </div>
              <div>
                <strong>96%</strong>
                <span>On-time dispatch</span>
              </div>
              <div>
                <strong>3.2 hrs</strong>
                <span>Avg. pickup ETA</span>
              </div>
            </div>
            <div className="panel-note">Integrates with 15+ courier partners.</div>
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

        <section className="faq">
          <div>
            <h2>Help center</h2>
            <p>Quick answers for shoppers, sellers, and admins.</p>
          </div>
          <div className="faq-grid">
            {catalog.faqs.map((item) => (
              <article key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="newsletter">
          <div>
            <h2>Get weekly drops and admin insights</h2>
            <p>Subscribe for exclusive deals, seller tips, and marketplace updates.</p>
          </div>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" required />
            <button className="cta" type="submit">Subscribe</button>
          </form>
        </section>

        <section className="cta-banner">
          <div>
            <h2>Ready to launch your marketplace?</h2>
            <p>Go live with smart pricing, omnichannel fulfillment, and live analytics.</p>
          </div>
          <button className="cta">Launch ShopSphere</button>
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
          <a href="#">Partner program</a>
        </div>
      </footer>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
