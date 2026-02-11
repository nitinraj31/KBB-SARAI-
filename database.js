const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database path
const dbPath = path.join(__dirname, 'agrimarket.db');

// Initialize database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create categories table
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      original_price REAL,
      discount INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      reviews INTEGER DEFAULT 0,
      image TEXT,
      category_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    )
  `);

  // Create orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      total_price REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `);

  // Seed initial data
  seedDatabase();
}

// Seed database with initial data
function seedDatabase() {
  // Check if categories exist
  db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
    if (err) {
      console.error('Error checking categories:', err.message);
      return;
    }

    if (row.count === 0) {
      // Insert categories
      const categories = [
        { name: 'Seeds', image: 'https://via.placeholder.com/150?text=Seeds' },
        { name: 'Fertilizers', image: 'https://via.placeholder.com/150?text=Fertilizers' },
        { name: 'Tools', image: 'https://via.placeholder.com/150?text=Tools' },
        { name: 'Machinery', image: 'https://via.placeholder.com/150?text=Machinery' },
        { name: 'Produce', image: 'https://via.placeholder.com/150?text=Produce' },
        { name: 'Livestock', image: 'https://via.placeholder.com/150?text=Livestock' }
      ];

      categories.forEach(category => {
        db.run('INSERT INTO categories (name, image) VALUES (?, ?)', [category.name, category.image]);
      });

      console.log('Seeded categories.');
    }
  });

  // Check if products exist
  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (err) {
      console.error('Error checking products:', err.message);
      return;
    }

    if (row.count === 0) {
      // Insert products
      const products = [
        { name: 'John Deere Tractor', price: 25000, original_price: 28000, discount: 11, rating: 4.8, reviews: 450, image: 'https://via.placeholder.com/200?text=Tractor', category_id: 4 },
        { name: 'Organic Seed Pack', price: 25, original_price: 35, discount: 29, rating: 4.6, reviews: 320, image: 'https://via.placeholder.com/200?text=Seeds', category_id: 1 },
        { name: 'NPK Fertilizer 50kg', price: 45, original_price: 55, discount: 18, rating: 4.4, reviews: 280, image: 'https://via.placeholder.com/200?text=Fertilizer', category_id: 2 },
        { name: 'Farm Tools Set', price: 120, original_price: 150, discount: 20, rating: 4.5, reviews: 190, image: 'https://via.placeholder.com/200?text=Tools', category_id: 3 },
        { name: 'Irrigation System', price: 299, original_price: 399, discount: 25, rating: 4.3, reviews: 180, image: 'https://via.placeholder.com/200?text=Irrigation', category_id: 3 },
        { name: 'Pesticide Spray', price: 35, original_price: 50, discount: 30, rating: 4.1, reviews: 220, image: 'https://via.placeholder.com/200?text=Spray', category_id: 3 },
        { name: 'Harvesting Tools', price: 85, original_price: 110, discount: 23, rating: 4.4, reviews: 150, image: 'https://via.placeholder.com/200?text=Harvest', category_id: 3 },
        { name: 'Greenhouse Kit', price: 450, original_price: 600, discount: 25, rating: 4.6, reviews: 90, image: 'https://via.placeholder.com/200?text=Greenhouse', category_id: 3 },
        { name: 'Corn Seeds 10kg', price: 40, original_price: 50, discount: 20, rating: 4.5, reviews: 200, image: 'https://via.placeholder.com/200?text=Corn+Seeds', category_id: 1 },
        { name: 'Wheat Seeds 5kg', price: 30, original_price: 40, discount: 25, rating: 4.3, reviews: 180, image: 'https://via.placeholder.com/200?text=Wheat+Seeds', category_id: 1 },
        { name: 'Rice Seeds 2kg', price: 20, original_price: 25, discount: 20, rating: 4.4, reviews: 150, image: 'https://via.placeholder.com/200?text=Rice+Seeds', category_id: 1 },
        { name: 'Soybean Seeds 3kg', price: 35, original_price: 45, discount: 22, rating: 4.6, reviews: 120, image: 'https://via.placeholder.com/200?text=Soybean+Seeds', category_id: 1 },
        { name: 'Potato Seeds 1kg', price: 15, original_price: 20, discount: 25, rating: 4.2, reviews: 100, image: 'https://via.placeholder.com/200?text=Potato+Seeds', category_id: 1 },
        { name: 'Tomato Seeds 500g', price: 10, original_price: 15, discount: 33, rating: 4.1, reviews: 90, image: 'https://via.placeholder.com/200?text=Tomato+Seeds', category_id: 1 },
        { name: 'Carrot Seeds 200g', price: 8, original_price: 12, discount: 33, rating: 4.0, reviews: 80, image: 'https://via.placeholder.com/200?text=Carrot+Seeds', category_id: 1 },
        { name: 'Lettuce Seeds 100g', price: 5, original_price: 8, discount: 38, rating: 3.9, reviews: 70, image: 'https://via.placeholder.com/200?text=Lettuce+Seeds', category_id: 1 },
        { name: 'Urea Fertilizer 25kg', price: 25, original_price: 30, discount: 17, rating: 4.3, reviews: 250, image: 'https://via.placeholder.com/200?text=Urea', category_id: 2 },
        { name: 'Phosphate Fertilizer 20kg', price: 30, original_price: 40, discount: 25, rating: 4.5, reviews: 220, image: 'https://via.placeholder.com/200?text=Phosphate', category_id: 2 },
        { name: 'Potash Fertilizer 15kg', price: 35, original_price: 45, discount: 22, rating: 4.4, reviews: 200, image: 'https://via.placeholder.com/200?text=Potash', category_id: 2 },
        { name: 'Organic Compost 50kg', price: 20, original_price: 25, discount: 20, rating: 4.6, reviews: 180, image: 'https://via.placeholder.com/200?text=Compost', category_id: 2 },
        { name: 'Lime Fertilizer 10kg', price: 15, original_price: 20, discount: 25, rating: 4.2, reviews: 160, image: 'https://via.placeholder.com/200?text=Lime', category_id: 2 },
        { name: 'Micronutrient Mix 5kg', price: 50, original_price: 65, discount: 23, rating: 4.7, reviews: 140, image: 'https://via.placeholder.com/200?text=Micronutrient', category_id: 2 },
        { name: 'Garden Hose 50ft', price: 25, original_price: 35, discount: 29, rating: 4.3, reviews: 300, image: 'https://via.placeholder.com/200?text=Hose', category_id: 3 },
        { name: 'Shovel Set', price: 40, original_price: 50, discount: 20, rating: 4.4, reviews: 280, image: 'https://via.placeholder.com/200?text=Shovel', category_id: 3 },
        { name: 'Pruning Shears', price: 15, original_price: 20, discount: 25, rating: 4.1, reviews: 260, image: 'https://via.placeholder.com/200?text=Shears', category_id: 3 },
        { name: 'Wheelbarrow', price: 80, original_price: 100, discount: 20, rating: 4.5, reviews: 240, image: 'https://via.placeholder.com/200?text=Wheelbarrow', category_id: 3 },
        { name: 'Garden Gloves', price: 10, original_price: 15, discount: 33, rating: 4.0, reviews: 220, image: 'https://via.placeholder.com/200?text=Gloves', category_id: 3 },
        { name: 'Soil Tester Kit', price: 30, original_price: 40, discount: 25, rating: 4.2, reviews: 200, image: 'https://via.placeholder.com/200?text=Soil+Tester', category_id: 3 },
        { name: 'Seed Drill Machine', price: 500, original_price: 650, discount: 23, rating: 4.6, reviews: 100, image: 'https://via.placeholder.com/200?text=Seed+Drill', category_id: 4 },
        { name: 'Plow Attachment', price: 200, original_price: 250, discount: 20, rating: 4.4, reviews: 80, image: 'https://via.placeholder.com/200?text=Plow', category_id: 4 },
        { name: 'Harvester Combine', price: 15000, original_price: 18000, discount: 17, rating: 4.8, reviews: 50, image: 'https://via.placeholder.com/200?text=Harvester', category_id: 4 },
        { name: 'Irrigation Pump', price: 300, original_price: 400, discount: 25, rating: 4.3, reviews: 120, image: 'https://via.placeholder.com/200?text=Pump', category_id: 4 },
        { name: 'Sprinkler System', price: 150, original_price: 200, discount: 25, rating: 4.5, reviews: 140, image: 'https://via.placeholder.com/200?text=Sprinkler', category_id: 4 },
        { name: 'Drip Irrigation Kit', price: 100, original_price: 130, discount: 23, rating: 4.4, reviews: 160, image: 'https://via.placeholder.com/200?text=Drip', category_id: 4 },
        { name: 'Fresh Apples 5kg', price: 15, original_price: 20, discount: 25, rating: 4.2, reviews: 300, image: 'https://via.placeholder.com/200?text=Apples', category_id: 5 },
        { name: 'Organic Bananas 2kg', price: 8, original_price: 10, discount: 20, rating: 4.3, reviews: 280, image: 'https://via.placeholder.com/200?text=Bananas', category_id: 5 },
        { name: 'Carrots 3kg', price: 6, original_price: 8, discount: 25, rating: 4.1, reviews: 260, image: 'https://via.placeholder.com/200?text=Carrots', category_id: 5 },
        { name: 'Potatoes 10kg', price: 12, original_price: 15, discount: 20, rating: 4.0, reviews: 240, image: 'https://via.placeholder.com/200?text=Potatoes', category_id: 5 },
        { name: 'Tomatoes 2kg', price: 5, original_price: 7, discount: 29, rating: 3.9, reviews: 220, image: 'https://via.placeholder.com/200?text=Tomatoes', category_id: 5 },
        { name: 'Lettuce Bundle', price: 4, original_price: 6, discount: 33, rating: 4.2, reviews: 200, image: 'https://via.placeholder.com/200?text=Lettuce', category_id: 5 },
        { name: 'Broccoli Heads', price: 7, original_price: 9, discount: 22, rating: 4.4, reviews: 180, image: 'https://via.placeholder.com/200?text=Broccoli', category_id: 5 },
        { name: 'Strawberries 500g', price: 10, original_price: 13, discount: 23, rating: 4.5, reviews: 160, image: 'https://via.placeholder.com/200?text=Strawberries', category_id: 5 },
        { name: 'Milk Cow', price: 1500, original_price: 1800, discount: 17, rating: 4.6, reviews: 50, image: 'https://via.placeholder.com/200?text=Cow', category_id: 6 },
        { name: 'Chicken Feed 20kg', price: 25, original_price: 30, discount: 17, rating: 4.3, reviews: 100, image: 'https://via.placeholder.com/200?text=Chicken+Feed', category_id: 6 },
        { name: 'Pig Fattening Feed 50kg', price: 40, original_price: 50, discount: 20, rating: 4.4, reviews: 80, image: 'https://via.placeholder.com/200?text=Pig+Feed', category_id: 6 },
        { name: 'Sheep Wool', price: 50, original_price: 65, discount: 23, rating: 4.5, reviews: 60, image: 'https://via.placeholder.com/200?text=Wool', category_id: 6 },
        { name: 'Goat Milk 5L', price: 20, original_price: 25, discount: 20, rating: 4.2, reviews: 90, image: 'https://via.placeholder.com/200?text=Goat+Milk', category_id: 6 },
        { name: 'Beef Meat 2kg', price: 30, original_price: 40, discount: 25, rating: 4.1, reviews: 70, image: 'https://via.placeholder.com/200?text=Beef', category_id: 6 },
        { name: 'Eggs 12 Pack', price: 6, original_price: 8, discount: 25, rating: 4.0, reviews: 150, image: 'https://via.placeholder.com/200?text=Eggs', category_id: 6 },
        { name: 'Honey 1kg', price: 15, original_price: 20, discount: 25, rating: 4.3, reviews: 120, image: 'https://via.placeholder.com/200?text=Honey', category_id: 6 },
        { name: 'Cheese Wheel 2kg', price: 25, original_price: 35, discount: 29, rating: 4.4, reviews: 100, image: 'https://via.placeholder.com/200?text=Cheese', category_id: 6 },
        { name: 'Butter 500g', price: 8, original_price: 10, discount: 20, rating: 4.2, reviews: 110, image: 'https://via.placeholder.com/200?text=Butter', category_id: 6 },
        { name: 'Yogurt 1L', price: 5, original_price: 7, discount: 29, rating: 4.1, reviews: 130, image: 'https://via.placeholder.com/200?text=Yogurt', category_id: 6 },
        { name: 'Corn Seeds 10kg', price: 40, original_price: 50, discount: 20, rating: 4.5, reviews: 200, image: 'https://via.placeholder.com/200?text=Corn+Seeds', category_id: 1 },
        { name: 'Wheat Seeds 5kg', price: 30, original_price: 40, discount: 25, rating: 4.3, reviews: 180, image: 'https://via.placeholder.com/200?text=Wheat+Seeds', category_id: 1 },
        { name: 'Rice Seeds 2kg', price: 20, original_price: 25, discount: 20, rating: 4.4, reviews: 150, image: 'https://via.placeholder.com/200?text=Rice+Seeds', category_id: 1 },
        { name: 'Soybean Seeds 3kg', price: 35, original_price: 45, discount: 22, rating: 4.6, reviews: 120, image: 'https://via.placeholder.com/200?text=Soybean+Seeds', category_id: 1 },
        { name: 'Potato Seeds 1kg', price: 15, original_price: 20, discount: 25, rating: 4.2, reviews: 100, image: 'https://via.placeholder.com/200?text=Potato+Seeds', category_id: 1 },
        { name: 'Tomato Seeds 500g', price: 10, original_price: 15, discount: 33, rating: 4.1, reviews: 90, image: 'https://via.placeholder.com/200?text=Tomato+Seeds', category_id: 1 },
        { name: 'Carrot Seeds 200g', price: 8, original_price: 12, discount: 33, rating: 4.0, reviews: 80, image: 'https://via.placeholder.com/200?text=Carrot+Seeds', category_id: 1 },
        { name: 'Lettuce Seeds 100g', price: 5, original_price: 8, discount: 38, rating: 3.9, reviews: 70, image: 'https://via.placeholder.com/200?text=Lettuce+Seeds', category_id: 1 },
        { name: 'Urea Fertilizer 25kg', price: 25, original_price: 30, discount: 17, rating: 4.3, reviews: 250, image: 'https://via.placeholder.com/200?text=Urea', category_id: 2 },
        { name: 'Phosphate Fertilizer 20kg', price: 30, original_price: 40, discount: 25, rating: 4.5, reviews: 220, image: 'https://via.placeholder.com/200?text=Phosphate', category_id: 2 },
        { name: 'Potash Fertilizer 15kg', price: 35, original_price: 45, discount: 22, rating: 4.4, reviews: 200, image: 'https://via.placeholder.com/200?text=Potash', category_id: 2 },
        { name: 'Organic Compost 50kg', price: 20, original_price: 25, discount: 20, rating: 4.6, reviews: 180, image: 'https://via.placeholder.com/200?text=Compost', category_id: 2 },
        { name: 'Lime Fertilizer 10kg', price: 15, original_price: 20, discount: 25, rating: 4.2, reviews: 160, image: 'https://via.placeholder.com/200?text=Lime', category_id: 2 },
        { name: 'Micronutrient Mix 5kg', price: 50, original_price: 65, discount: 23, rating: 4.7, reviews: 140, image: 'https://via.placeholder.com/200?text=Micronutrient', category_id: 2 },
        { name: 'Garden Hose 50ft', price: 25, original_price: 35, discount: 29, rating: 4.3, reviews: 300, image: 'https://via.placeholder.com/200?text=Hose', category_id: 3 },
        { name: 'Shovel Set', price: 40, original_price: 50, discount: 20, rating: 4.4, reviews: 280, image: 'https://via.placeholder.com/200?text=Shovel', category_id: 3 },
        { name: 'Pruning Shears', price: 15, original_price: 20, discount: 25, rating: 4.1, reviews: 260, image: 'https://via.placeholder.com/200?text=Shears', category_id: 3 },
        { name: 'Wheelbarrow', price: 80, original_price: 100, discount: 20, rating: 4.5, reviews: 240, image: 'https://via.placeholder.com/200?text=Wheelbarrow', category_id: 3 },
        { name: 'Garden Gloves', price: 10, original_price: 15, discount: 33, rating: 4.0, reviews: 220, image: 'https://via.placeholder.com/200?text=Gloves', category_id: 3 },
        { name: 'Soil Tester Kit', price: 30, original_price: 40, discount: 25, rating: 4.2, reviews: 200, image: 'https://via.placeholder.com/200?text=Soil+Tester', category_id: 3 },
        { name: 'Seed Drill Machine', price: 500, original_price: 650, discount: 23, rating: 4.6, reviews: 100, image: 'https://via.placeholder.com/200?text=Seed+Drill', category_id: 4 },
        { name: 'Plow Attachment', price: 200, original_price: 250, discount: 20, rating: 4.4, reviews: 80, image: 'https://via.placeholder.com/200?text=Plow', category_id: 4 },
        { name: 'Harvester Combine', price: 15000, original_price: 18000, discount: 17, rating: 4.8, reviews: 50, image: 'https://via.placeholder.com/200?text=Harvester', category_id: 4 },
        { name: 'Irrigation Pump', price: 300, original_price: 400, discount: 25, rating: 4.3, reviews: 120, image: 'https://via.placeholder.com/200?text=Pump', category_id: 4 },
        { name: 'Sprinkler System', price: 150, original_price: 200, discount: 25, rating: 4.5, reviews: 140, image: 'https://via.placeholder.com/200?text=Sprinkler', category_id: 4 },
        { name: 'Drip Irrigation Kit', price: 100, original_price: 130, discount: 23, rating: 4.4, reviews: 160, image: 'https://via.placeholder.com/200?text=Drip', category_id: 4 },
        { name: 'Fresh Apples 5kg', price: 15, original_price: 20, discount: 25, rating: 4.2, reviews: 300, image: 'https://via.placeholder.com/200?text=Apples', category_id: 5 },
        { name: 'Organic Bananas 2kg', price: 8, original_price: 10, discount: 20, rating: 4.3, reviews: 280, image: 'https://via.placeholder.com/200?text=Bananas', category_id: 5 },
        { name: 'Carrots 3kg', price: 6, original_price: 8, discount: 25, rating: 4.1, reviews: 260, image: 'https://via.placeholder.com/200?text=Carrots', category_id: 5 },
        { name: 'Potatoes 10kg', price: 12, original_price: 15, discount: 20, rating: 4.0, reviews: 240, image: 'https://via.placeholder.com/200?text=Potatoes', category_id: 5 },
        { name: 'Tomatoes 2kg', price: 5, original_price: 7, discount: 29, rating: 3.9, reviews: 220, image: 'https://via.placeholder.com/200?text=Tomatoes', category_id: 5 },
        { name: 'Lettuce Bundle', price: 4, original_price: 6, discount: 33, rating: 4.2, reviews: 200, image: 'https://via.placeholder.com/200?text=Lettuce', category_id: 5 },
        { name: 'Broccoli Heads', price: 7, original_price: 9, discount: 22, rating: 4.4, reviews: 180, image: 'https://via.placeholder.com/200?text=Broccoli', category_id: 5 },
        { name: 'Strawberries 500g', price: 10, original_price: 13, discount: 23, rating: 4.5, reviews: 160, image: 'https://via.placeholder.com/200?text=Strawberries', category_id: 5 },
        { name: 'Milk Cow', price: 1500, original_price: 1800, discount: 17, rating: 4.6, reviews: 50, image: 'https://via.placeholder.com/200?text=Cow', category_id: 6 },
        { name: 'Chicken Feed 20kg', price: 25, original_price: 30, discount: 17, rating: 4.3, reviews: 100, image: 'https://via.placeholder.com/200?text=Chicken+Feed', category_id: 6 },
        { name: 'Pig Fattening Feed 50kg', price: 40, original_price: 50, discount: 20, rating: 4.4, reviews: 80, image: 'https://via.placeholder.com/200?text=Pig+Feed', category_id: 6 },
        { name: 'Sheep Wool', price: 50, original_price: 65, discount: 23, rating: 4.5, reviews: 60, image: 'https://via.placeholder.com/200?text=Wool', category_id: 6 },
        { name: 'Goat Milk 5L', price: 20, original_price: 25, discount: 20, rating: 4.2, reviews: 90, image: 'https://via.placeholder.com/200?text=Goat+Milk', category_id: 6 },
        { name: 'Beef Meat 2kg', price: 30, original_price: 40, discount: 25, rating: 4.1, reviews: 70, image: 'https://via.placeholder.com/200?text=Beef', category_id: 6 },
        { name: 'Eggs 12 Pack', price: 6, original_price: 8, discount: 25, rating: 4.0, reviews: 150, image: 'https://via.placeholder.com/200?text=Eggs', category_id: 6 },
        { name: 'Honey 1kg', price: 15, original_price: 20, discount: 25, rating: 4.3, reviews: 120, image: 'https://via.placeholder.com/200?text=Honey', category_id: 6 },
        { name: 'Cheese Wheel 2kg', price: 25, original_price: 35, discount: 29, rating: 4.4, reviews: 100, image: 'https://via.placeholder.com/200?text=Cheese', category_id: 6 },
        { name: 'Butter 500g', price: 8, original_price: 10, discount: 20, rating: 4.2, reviews: 110, image: 'https://via.placeholder.com/200?text=Butter', category_id: 6 },
        { name: 'Yogurt 1L', price: 5, original_price: 7, discount: 29, rating: 4.1, reviews: 130, image: 'https://via.placeholder.com/200?text=Yogurt', category_id: 6 },
        { name: 'Organic Pesticide 1L', price: 25, original_price: 35, discount: 29, rating: 4.2, reviews: 140, image: 'https://via.placeholder.com/200?text=Pesticide', category_id: 3 },
        { name: 'Herbicide Spray 500ml', price: 15, original_price: 20, discount: 25, rating: 4.0, reviews: 120, image: 'https://via.placeholder.com/200?text=Herbicide', category_id: 3 },
        { name: 'Fungicide Powder 1kg', price: 30, original_price: 40, discount: 25, rating: 4.3, reviews: 100, image: 'https://via.placeholder.com/200?text=Fungicide', category_id: 2 },
        { name: 'Insecticide Liquid 250ml', price: 20, original_price: 25, discount: 20, rating: 4.1, reviews: 90, image: 'https://via.placeholder.com/200?text=Insecticide', category_id: 3 },
        { name: 'Weed Killer 1L', price: 18, original_price: 22, discount: 18, rating: 3.9, reviews: 80, image: 'https://via.placeholder.com/200?text=Weed+Killer', category_id: 3 },
        { name: 'Plant Growth Regulator 100ml', price: 40, original_price: 50, discount: 20, rating: 4.4, reviews: 70, image: 'https://via.placeholder.com/200?text=Growth+Regulator', category_id: 2 },
        { name: 'Biofertilizer 5kg', price: 35, original_price: 45, discount: 22, rating: 4.5, reviews: 60, image: 'https://via.placeholder.com/200?text=Biofertilizer', category_id: 2 },
        { name: 'Vermicompost 10kg', price: 25, original_price: 30, discount: 17, rating: 4.6, reviews: 50, image: 'https://via.placeholder.com/200?text=Vermicompost', category_id: 2 },
        { name: 'Seaweed Extract 1L', price: 45, original_price: 55, discount: 18, rating: 4.7, reviews: 40, image: 'https://via.placeholder.com/200?text=Seaweed', category_id: 2 },
        { name: 'Bone Meal 2kg', price: 20, original_price: 25, discount: 20, rating: 4.3, reviews: 30, image: 'https://via.placeholder.com/200?text=Bone+Meal', category_id: 2 },
        { name: 'Blood Meal 1kg', price: 15, original_price: 18, discount: 17, rating: 4.2, reviews: 25, image: 'https://via.placeholder.com/200?text=Blood+Meal', category_id: 2 },
        { name: 'Fish Emulsion 500ml', price: 12, original_price: 15, discount: 20, rating: 4.1, reviews: 20, image: 'https://via.placeholder.com/200?text=Fish+Emulsion', category_id: 2 },
        { name: 'Epsom Salt 1kg', price: 8, original_price: 10, discount: 20, rating: 4.0, reviews: 15, image: 'https://via.placeholder.com/200?text=Epsom+Salt', category_id: 2 },
        { name: 'Gypsum Powder 5kg', price: 18, original_price: 22, discount: 18, rating: 4.4, reviews: 10, image: 'https://via.placeholder.com/200?text=Gypsum', category_id: 2 },
        { name: 'Dolomite Lime 10kg', price: 22, original_price: 28, discount: 21, rating: 4.5, reviews: 5, image: 'https://via.placeholder.com/200?text=Dolomite', category_id: 2 },
        { name: 'Sulfur Powder 2kg', price: 14, original_price: 17, discount: 18, rating: 4.3, reviews: 8, image: 'https://via.placeholder.com/200?text=Sulfur', category_id: 2 },
        { name: 'Potassium Nitrate 1kg', price: 25, original_price: 30, discount: 17, rating: 4.6, reviews: 12, image: 'https://via.placeholder.com/200?text=Potassium+Nitrate', category_id: 2 },
        { name: 'Ammonium Sulfate 5kg', price: 20, original_price: 25, discount: 20, rating: 4.4, reviews: 15, image: 'https://via.placeholder.com/200?text=Ammonium+Sulfate', category_id: 2 },
        { name: 'Triple Superphosphate 10kg', price: 35, original_price: 45, discount: 22, rating: 4.7, reviews: 20, image: 'https://via.placeholder.com/200?text=Triple+Superphosphate', category_id: 2 },
        { name: 'Monoammonium Phosphate 5kg', price: 30, original_price: 38, discount: 21, rating: 4.5, reviews: 18, image: 'https://via.placeholder.com/200?text=Monoammonium+Phosphate', category_id: 2 },
        { name: 'Diammonium Phosphate 10kg', price: 40, original_price: 50, discount: 20, rating: 4.6, reviews: 25, image: 'https://via.placeholder.com/200?text=Diammonium+Phosphate', category_id: 2 },
        { name: 'Muriate of Potash 5kg', price: 28, original_price: 35, discount: 20, rating: 4.4, reviews: 22, image: 'https://via.placeholder.com/200?text=Muriate+of+Potash', category_id: 2 },
        { name: 'Sulfate of Potash 2kg', price: 32, original_price: 40, discount: 20, rating: 4.5, reviews: 20, image: 'https://via.placeholder.com/200?text=Sulfate+of+Potash', category_id: 2 },
        { name: 'Calcium Nitrate 5kg', price: 26, original_price: 32, discount: 19, rating: 4.3, reviews: 17, image: 'https://via.placeholder.com/200?text=Calcium+Nitrate', category_id: 2 },
        { name: 'Magnesium Sulfate 1kg', price: 10, original_price: 12, discount: 17, rating: 4.2, reviews: 14, image: 'https://via.placeholder.com/200?text=Magnesium+Sulfate', category_id: 2 },
        { name: 'Iron Chelate 500g', price: 18, original_price: 22, discount: 18, rating: 4.4, reviews: 11, image: 'https://via.placeholder.com/200?text=Iron+Chelate', category_id: 2 },
        { name: 'Zinc Sulfate 1kg', price: 12, original_price: 15, discount: 20, rating: 4.1, reviews: 9, image: 'https://via.placeholder.com/200?text=Zinc+Sulfate', category_id: 2 },
        { name: 'Copper Sulfate 500g', price: 16, original_price: 20, discount: 20, rating: 4.3, reviews: 7, image: 'https://via.placeholder.com/200?text=Copper+Sulfate', category_id: 2 },
        { name: 'Boron 100g', price: 8, original_price: 10, discount: 20, rating: 4.0, reviews: 6, image: 'https://via.placeholder.com/200?text=Boron', category_id: 2 },
        { name: 'Manganese Sulfate 500g', price: 14, original_price: 17, discount: 18, rating: 4.2, reviews: 5, image: 'https://via.placeholder.com/200?text=Manganese+Sulfate', category_id: 2 },
        { name: 'Molybdenum 50g', price: 20, original_price: 25, discount: 20, rating: 4.5, reviews: 4, image: 'https://via.placeholder.com/200?text=Molybdenum', category_id: 2 },
        { name: 'Cobalt Sulfate 100g', price: 22, original_price: 28, discount: 21, rating: 4.6, reviews: 3, image: 'https://via.placeholder.com/200?text=Cobalt+Sulfate', category_id: 2 },
        { name: 'Nickel Sulfate 50g', price: 25, original_price: 30, discount: 17, rating: 4.7, reviews: 2, image: 'https://via.placeholder.com/200?text=Nickel+Sulfate', category_id: 2 },
        { name: 'Chlorine 1kg', price: 15, original_price: 18, discount: 17, rating: 4.3, reviews: 1, image: 'https://via.placeholder.com/200?text=Chlorine', category_id: 2 },
        { name: 'Sodium Molybdate 100g', price: 30, original_price: 35, discount: 14, rating: 4.8, reviews: 1, image: 'https://via.placeholder.com/200?text=Sodium+Molybdate', category_id: 2 },
        { name: 'Vanadium 50g', price: 35, original_price: 40, discount: 13, rating: 4.9, reviews: 1, image: 'https://via.placeholder.com/200?text=Vanadium', category_id: 2 },
        { name: 'Silicon 1kg', price: 18, original_price: 22, discount: 18, rating: 4.4, reviews: 2, image: 'https://via.placeholder.com/200?text=Silicon', category_id: 2 },
        { name: 'Selenium 100g', price: 40, original_price: 45, discount: 11, rating: 4.9, reviews: 1, image: 'https://via.placeholder.com/200?text=Selenium', category_id: 2 },
        { name: 'Iodine 50g', price: 45, original_price: 50, discount: 10, rating: 5.0, reviews: 1, image: 'https://via.placeholder.com/200?text=Iodine', category_id: 2 },
        { name: 'Chromium 100g', price: 50, original_price: 55, discount: 9, rating: 4.8, reviews: 1, image: 'https://via.placeholder.com/200?text=Chromium', category_id: 2 },
        { name: 'Tungsten 50g', price: 55, original_price: 60, discount: 8, rating: 4.7, reviews: 1, image: 'https://via.placeholder.com/200?text=Tungsten', category_id: 2 },
        { name: 'Titanium 100g', price: 60, original_price: 65, discount: 8, rating: 4.6, reviews: 1, image: 'https://via.placeholder.com/200?text=Titanium', category_id: 2 },
        { name: 'Aluminum Sulfate 5kg', price: 25, original_price: 30, discount: 17, rating: 4.3, reviews: 3, image: 'https://via.placeholder.com/200?text=Aluminum+Sulfate', category_id: 2 },
        { name: 'Sodium Chloride 10kg', price: 15, original_price: 18, discount: 17, rating: 4.2, reviews: 4, image: 'https://via.placeholder.com/200?text=Sodium+Chloride', category_id: 2 },
        { name: 'Potassium Chloride 5kg', price: 20, original_price: 25, discount: 20, rating: 4.4, reviews: 5, image: 'https://via.placeholder.com/200?text=Potassium+Chloride', category_id: 2 },
        { name: 'Magnesium Chloride 2kg', price: 18, original_price: 22, discount: 18, rating: 4.3, reviews: 6, image: 'https://via.placeholder.com/200?text=Magnesium+Chloride', category_id: 2 },
        { name: 'Advanced Tractor Model X', price: 35000, original_price: 40000, discount: 13, rating: 4.9, reviews: 75, image: 'https://via.placeholder.com/200?text=Advanced+Tractor', category_id: 4 },
        { name: 'Compact Utility Tractor', price: 18000, original_price: 22000, discount: 18, rating: 4.7, reviews: 120, image: 'https://via.placeholder.com/200?text=Utility+Tractor', category_id: 4 },
        { name: 'Heavy Duty Plow Set', price: 350, original_price: 450, discount: 22, rating: 4.6, reviews: 95, image: 'https://via.placeholder.com/200?text=Heavy+Plow', category_id: 4 },
        { name: 'Precision Seeder', price: 1200, original_price: 1500, discount: 20, rating: 4.8, reviews: 60, image: 'https://via.placeholder.com/200?text=Precision+Seeder', category_id: 4 },
        { name: 'GPS Guided Harvester', price: 18000, original_price: 21000, discount: 14, rating: 4.9, reviews: 45, image: 'https://via.placeholder.com/200?text=GPS+Harvester', category_id: 4 },
        { name: 'Solar Powered Pump', price: 450, original_price: 550, discount: 18, rating: 4.5, reviews: 85, image: 'https://via.placeholder.com/200?text=Solar+Pump', category_id: 4 },
        { name: 'Automated Irrigation Controller', price: 280, original_price: 350, discount: 20, rating: 4.4, reviews: 110, image: 'https://via.placeholder.com/200?text=Irrigation+Controller', category_id: 4 },
        { name: 'Weather Station Kit', price: 150, original_price: 200, discount: 25, rating: 4.3, reviews: 75, image: 'https://via.placeholder.com/200?text=Weather+Station', category_id: 4 },
        { name: 'Grain Storage Silo', price: 2500, original_price: 3000, discount: 17, rating: 4.6, reviews: 30, image: 'https://via.placeholder.com/200?text=Grain+Silo', category_id: 4 },
        { name: 'Feed Mixer Wagon', price: 850, original_price: 1000, discount: 15, rating: 4.5, reviews: 55, image: 'https://via.placeholder.com/200?text=Feed+Mixer', category_id: 4 },
        { name: 'Milking Machine', price: 1200, original_price: 1400, discount: 14, rating: 4.7, reviews: 40, image: 'https://via.placeholder.com/200?text=Milking+Machine', category_id: 4 },
        { name: 'Egg Incubator', price: 180, original_price: 220, discount: 18, rating: 4.4, reviews: 65, image: 'https://via.placeholder.com/200?text=Egg+Incubator', category_id: 4 },
        { name: 'Poultry Feeder System', price: 95, original_price: 120, discount: 21, rating: 4.3, reviews: 90, image: 'https://via.placeholder.com/200?text=Poultry+Feeder', category_id: 4 },
        { name: 'Fresh Strawberries 500g', price: 10, original_price: 13, discount: 23, rating: 4.5, reviews: 160, image: 'https://via.placeholder.com/200?text=Strawberries', category_id: 5 },
        { name: 'Blueberries 250g', price: 12, original_price: 16, discount: 25, rating: 4.6, reviews: 140, image: 'https://via.placeholder.com/200?text=Blueberries', category_id: 5 },
        { name: 'Raspberries 300g', price: 9, original_price: 12, discount: 25, rating: 4.4, reviews: 130, image: 'https://via.placeholder.com/200?text=Raspberries', category_id: 5 },
        { name: 'Blackberries 400g', price: 11, original_price: 14, discount: 21, rating: 4.5, reviews: 120, image: 'https://via.placeholder.com/200?text=Blackberries', category_id: 5 },
        { name: 'Avocados 2kg', price: 8, original_price: 10, discount: 20, rating: 4.3, reviews: 180, image: 'https://via.placeholder.com/200?text=Avocados', category_id: 5 },
        { name: 'Mangoes 3kg', price: 12, original_price: 15, discount: 20, rating: 4.4, reviews: 150, image: 'https://via.placeholder.com/200?text=Mangoes', category_id: 5 },
        { name: 'Pineapples 2kg', price: 7, original_price: 9, discount: 22, rating: 4.2, reviews: 170, image: 'https://via.placeholder.com/200?text=Pineapples', category_id: 5 },
        { name: 'Kiwi Fruit 1kg', price: 14, original_price: 18, discount: 22, rating: 4.5, reviews: 100, image: 'https://via.placeholder.com/200?text=Kiwi', category_id: 5 },
        { name: 'Pears 2kg', price: 6, original_price: 8, discount: 25, rating: 4.1, reviews: 140, image: 'https://via.placeholder.com/200?text=Pears', category_id: 5 },
        { name: 'Plums 1.5kg', price: 8, original_price: 11, discount: 27, rating: 4.3, reviews: 125, image: 'https://via.placeholder.com/200?text=Plums', category_id: 5 },
        { name: 'Grapes 2kg', price: 9, original_price: 12, discount: 25, rating: 4.4, reviews: 155, image: 'https://via.placeholder.com/200?text=Grapes', category_id: 5 },
        { name: 'Cherries 500g', price: 16, original_price: 20, discount: 20, rating: 4.6, reviews: 95, image: 'https://via.placeholder.com/200?text=Cherries', category_id: 5 },
        { name: 'Peaches 2kg', price: 10, original_price: 13, discount: 23, rating: 4.4, reviews: 135, image: 'https://via.placeholder.com/200?text=Peaches', category_id: 5 },
        { name: 'Nectarines 1.5kg', price: 11, original_price: 14, discount: 21, rating: 4.5, reviews: 110, image: 'https://via.placeholder.com/200?text=Nectarines', category_id: 5 },
        { name: 'Apricots 1kg', price: 13, original_price: 16, discount: 19, rating: 4.3, reviews: 85, image: 'https://via.placeholder.com/200?text=Apricots', category_id: 5 },
        { name: 'Figs 500g', price: 15, original_price: 19, discount: 21, rating: 4.7, reviews: 70, image: 'https://via.placeholder.com/200?text=Figs', category_id: 5 },
        { name: 'Pomegranate 1kg', price: 8, original_price: 10, discount: 20, rating: 4.4, reviews: 105, image: 'https://via.placeholder.com/200?text=Pomegranate', category_id: 5 },
        { name: 'Passion Fruit 500g', price: 12, original_price: 15, discount: 20, rating: 4.5, reviews: 80, image: 'https://via.placeholder.com/200?text=Passion+Fruit', category_id: 5 },
        { name: 'Dragon Fruit 1kg', price: 18, original_price: 22, discount: 18, rating: 4.6, reviews: 65, image: 'https://via.placeholder.com/200?text=Dragon+Fruit', category_id: 5 },
        { name: 'Lychee 500g', price: 14, original_price: 17, discount: 18, rating: 4.4, reviews: 75, image: 'https://via.placeholder.com/200?text=Lychee', category_id: 5 },
        { name: 'Rambutan 1kg', price: 16, original_price: 20, discount: 20, rating: 4.5, reviews: 60, image: 'https://via.placeholder.com/200?text=Rambutan', category_id: 5 },
        { name: 'Durian 2kg', price: 25, original_price: 30, discount: 17, rating: 4.7, reviews: 50, image: 'https://via.placeholder.com/200?text=Durian', category_id: 5 },
        { name: 'Jackfruit 3kg', price: 20, original_price: 25, discount: 20, rating: 4.3, reviews: 55, image: 'https://via.placeholder.com/200?text=Jackfruit', category_id: 5 },
        { name: 'Papaya 2kg', price: 5, original_price: 7, discount: 29, rating: 4.2, reviews: 145, image: 'https://via.placeholder.com/200?text=Papaya', category_id: 5 },
        { name: 'Guava 1.5kg', price: 7, original_price: 9, discount: 22, rating: 4.1, reviews: 125, image: 'https://via.placeholder.com/200?text=Guava', category_id: 5 },
        { name: 'Star Fruit 1kg', price: 9, original_price: 11, discount: 18, rating: 4.3, reviews: 95, image: 'https://via.placeholder.com/200?text=Star+Fruit', category_id: 5 },
        { name: 'Longan 500g', price: 13, original_price: 16, discount: 19, rating: 4.4, reviews: 70, image: 'https://via.placeholder.com/200?text=Longan', category_id: 5 },
        { name: 'Persimmon 1kg', price: 11, original_price: 14, discount: 21, rating: 4.5, reviews: 85, image: 'https://via.placeholder.com/200?text=Persimmon', category_id: 5 },
        { name: 'Clementines 2kg', price: 8, original_price: 10, discount: 20, rating: 4.2, reviews: 115, image: 'https://via.placeholder.com/200?text=Clementines', category_id: 5 },
        { name: 'Tangerines 2kg', price: 7, original_price: 9, discount: 22, rating: 4.1, reviews: 130, image: 'https://via.placeholder.com/200?text=Tangerines', category_id: 5 },
        { name: 'Mandarins 1.5kg', price: 9, original_price: 12, discount: 25, rating: 4.3, reviews: 110, image: 'https://via.placeholder.com/200?text=Mandarins', category_id: 5 },
        { name: 'Blood Oranges 2kg', price: 12, original_price: 15, discount: 20, rating: 4.6, reviews: 90, image: 'https://via.placeholder.com/200?text=Blood+Oranges', category_id: 5 },
        { name: 'Navel Oranges 3kg', price: 10, original_price: 13, discount: 23, rating: 4.4, reviews: 140, image: 'https://via.placeholder.com/200?text=Navel+Oranges', category_id: 5 },
        { name: 'Valencia Oranges 2.5kg', price: 9, original_price: 11, discount: 18, rating: 4.3, reviews: 125, image: 'https://via.placeholder.com/200?text=Valencia+Oranges', category_id: 5 },
        { name: 'Grapefruit 2kg', price: 8, original_price: 10, discount: 20, rating: 4.2, reviews: 105, image: 'https://via.placeholder.com/200?text=Grapefruit', category_id: 5 },
        { name: 'Lemons 1kg', price: 4, original_price: 6, discount: 33, rating: 4.0, reviews: 160, image: 'https://via.placeholder.com/200?text=Lemons', category_id: 5 },
        { name: 'Limes 500g', price: 3, original_price: 4, discount: 25, rating: 3.9, reviews: 145, image: 'https://via.placeholder.com/200?text=Limes', category_id: 5 },
        { name: 'Beef Cattle', price: 2000, original_price: 2400, discount: 17, rating: 4.8, reviews: 35, image: 'https://via.placeholder.com/200?text=Beef+Cattle', category_id: 6 },
        { name: 'Dairy Cow', price: 1800, original_price: 2200, discount: 18, rating: 4.7, reviews: 40, image: 'https://via.placeholder.com/200?text=Dairy+Cow', category_id: 6 },
        { name: 'Sheep Flock', price: 800, original_price: 1000, discount: 20, rating: 4.5, reviews: 55, image: 'https://via.placeholder.com/200?text=Sheep+Flock', category_id: 6 },
        { name: 'Goat Herd', price: 600, original_price: 750, discount: 20, rating: 4.4, reviews: 65, image: 'https://via.placeholder.com/200?text=Goat+Herd', category_id: 6 },
        { name: 'Pig Breeding Stock', price: 400, original_price: 500, discount: 20, rating: 4.3, reviews: 70, image: 'https://via.placeholder.com/200?text=Pig+Stock', category_id: 6 },
        { name: 'Chicken Broiler', price: 25, original_price: 30, discount: 17, rating: 4.2, reviews: 180, image: 'https://via.placeholder.com/200?text=Broiler+Chicken', category_id: 6 },
        { name: 'Turkey Breeder', price: 45, original_price: 55, discount: 18, rating: 4.4, reviews: 90, image: 'https://via.placeholder.com/200?text=Turkey+Breeder', category_id: 6 },
        { name: 'Duck Breeder', price: 35, original_price: 42, discount: 17, rating: 4.3, reviews: 75, image: 'https://via.placeholder.com/200?text=Duck+Breeder', category_id: 6 },
        { name: 'Quail Eggs 50 Pack', price: 12, original_price: 15, discount: 20, rating: 4.1, reviews: 110, image: 'https://via.placeholder.com/200?text=Quail+Eggs', category_id: 6 },
        { name: 'Emu Meat 2kg', price: 50, original_price: 65, discount: 23, rating: 4.6, reviews: 25, image: 'https://via.placeholder.com/200?text=Emu+Meat', category_id: 6 },
        { name: 'Rabbit Pelts', price: 30, original_price: 38, discount: 21, rating: 4.2, reviews: 45, image: 'https://via.placeholder.com/200?text=Rabbit+Pelts', category_id: 6 },
        { name: 'Alpaca Wool 5kg', price: 120, original_price: 150, discount: 20, rating: 4.7, reviews: 30, image: 'https://via.placeholder.com/200?text=Alpaca+Wool', category_id: 6 },
        { name: 'Silk Worm Cocoons 1kg', price: 200, original_price: 250, discount: 20, rating: 4.8, reviews: 15, image: 'https://via.placeholder.com/200?text=Silk+Cocoons', category_id: 6 },
        { name: 'Caviar 100g', price: 150, original_price: 200, discount: 25, rating: 4.9, reviews: 20, image: 'https://via.placeholder.com/200?text=Caviar', category_id: 6 },
        { name: 'Trout Fillets 1kg', price: 25, original_price: 30, discount: 17, rating: 4.4, reviews: 85, image: 'https://via.placeholder.com/200?text=Trout+Fillets', category_id: 6 },
        { name: 'Salmon Steak 500g', price: 18, original_price: 22, discount: 18, rating: 4.5, reviews: 95, image: 'https://via.placeholder.com/200?text=Salmon+Steak', category_id: 6 },
        { name: 'Tuna Loin 1kg', price: 35, original_price: 45, discount: 22, rating: 4.6, reviews: 70, image: 'https://via.placeholder.com/200?text=Tuna+Loin', category_id: 6 },
        { name: 'Shrimp 500g', price: 20, original_price: 25, discount: 20, rating: 4.3, reviews: 120, image: 'https://via.placeholder.com/200?text=Shrimp', category_id: 6 },
        { name: 'Lobster Tail 500g', price: 45, original_price: 55, discount: 18, rating: 4.7, reviews: 50, image: 'https://via.placeholder.com/200?text=Lobster+Tail', category_id: 6 },
        { name: 'Crab Meat 400g', price: 28, original_price: 35, discount: 20, rating: 4.4, reviews: 65, image: 'https://via.placeholder.com/200?text=Crab+Meat', category_id: 6 },
        { name: 'Oyster Meat 300g', price: 22, original_price: 28, discount: 21, rating: 4.5, reviews: 55, image: 'https://via.placeholder.com/200?text=Oyster+Meat', category_id: 6 },
        { name: 'Clam Meat 500g', price: 15, original_price: 19, discount: 21, rating: 4.2, reviews: 80, image: 'https://via.placeholder.com/200?text=Clam+Meat', category_id: 6 },
        { name: 'Mussel Meat 400g', price: 12, original_price: 15, discount: 20, rating: 4.1, reviews: 90, image: 'https://via.placeholder.com/200?text=Mussel+Meat', category_id: 6 },
        { name: 'Scallop Meat 300g', price: 30, original_price: 38, discount: 21, rating: 4.6, reviews: 45, image: 'https://via.placeholder.com/200?text=Scallop+Meat', category_id: 6 },
        { name: 'Squid Rings 500g', price: 18, original_price: 22, discount: 18, rating: 4.3, reviews: 75, image: 'https://via.placeholder.com/200?text=Squid+Rings', category_id: 6 },
        { name: 'Octopus Tentacles 600g', price: 25, original_price: 30, discount: 17, rating: 4.4, reviews: 60, image: 'https://via.placeholder.com/200?text=Octopus+Tentacles', category_id: 6 },
        { name: 'Sea Bass Fillet 500g', price: 22, original_price: 27, discount: 19, rating: 4.5, reviews: 70, image: 'https://via.placeholder.com/200?text=Sea+Bass+Fillet', category_id: 6 },
        { name: 'Halibut Steak 600g', price: 28, original_price: 35, discount: 20, rating: 4.6, reviews: 55, image: 'https://via.placeholder.com/200?text=Halibut+Steak', category_id: 6 },
        { name: 'Cod Fillet 700g', price: 20, original_price: 25, discount: 20, rating: 4.4, reviews: 80, image: 'https://via.placeholder.com/200?text=Cod+Fillet', category_id: 6 },
        { name: 'Haddock Fillet 500g', price: 16, original_price: 20, discount: 20, rating: 4.3, reviews: 85, image: 'https://via.placeholder.com/200?text=Haddock+Fillet', category_id: 6 },
        { name: 'Tilapia Fillet 600g', price: 12, original_price: 15, discount: 20, rating: 4.2, reviews: 95, image: 'https://via.placeholder.com/200?text=Tilapia+Fillet', category_id: 6 },
        { name: 'Catfish Fillet 500g', price: 14, original_price: 17, discount: 18, rating: 4.1, reviews: 100, image: 'https://via.placeholder.com/200?text=Catfish+Fillet', category_id: 6 },
        { name: 'Pangasius Fillet 800g', price: 10, original_price: 12, discount: 17, rating: 4.0, reviews: 110, image: 'https://via.placeholder.com/200?text=Pangasius+Fillet', category_id: 6 },
        { name: 'Barramundi Fillet 500g', price: 24, original_price: 30, discount: 20, rating: 4.5, reviews: 50, image: 'https://via.placeholder.com/200?text=Barramundi+Fillet', category_id: 6 },
        { name: 'Snapper Fillet 600g', price: 26, original_price: 32, discount: 19, rating: 4.6, reviews: 45, image: 'https://via.placeholder.com/200?text=Snapper+Fillet', category_id: 6 },
        { name: 'Grouper Fillet 500g', price: 30, original_price: 38, discount: 21, rating: 4.7, reviews: 40, image: 'https://via.placeholder.com/200?text=Grouper+Fillet', category_id: 6 },
        { name: 'Mahi Mahi Fillet 500g', price: 32, original_price: 40, discount: 20, rating: 4.8, reviews: 35, image: 'https://via.placeholder.com/200?text=Mahi+Mahi+Fillet', category_id: 6 },
        { name: 'Swordfish Steak 600g', price: 35, original_price: 45, discount: 22, rating: 4.7, reviews: 30, image: 'https://via.placeholder.com/200?text=Swordfish+Steak', category_id: 6 },
        { name: 'Marlin Steak 500g', price: 40, original_price: 50, discount: 20, rating: 4.8, reviews: 25, image: 'https://via.placeholder.com/200?text=Marlin+Steak', category_id: 6 },
        { name: 'Tuna Steak 600g', price: 38, original_price: 48, discount: 21, rating: 4.7, reviews: 35, image: 'https://via.placeholder.com/200?text=Tuna+Steak', category_id: 6 },
        { name: 'Yellowfin Tuna 500g', price: 36, original_price: 45, discount: 20, rating: 4.6, reviews: 40, image: 'https://via.placeholder.com/200?text=Yellowfin+Tuna', category_id: 6 },
        { name: 'Bluefin Tuna 400g', price: 50, original_price: 65, discount: 23, rating: 4.9, reviews: 20, image: 'https://via.placeholder.com/200?text=Bluefin+Tuna', category_id: 6 },
        { name: 'Ahi Tuna 500g', price: 34, original_price: 42, discount: 19, rating: 4.5, reviews: 45, image: 'https://via.placeholder.com/200?text=Ahi+Tuna', category_id: 6 },
        { name: 'Skipjack Tuna 600g', price: 20, original_price: 25, discount: 20, rating: 4.3, reviews: 60, image: 'https://via.placeholder.com/200?text=Skipjack+Tuna', category_id: 6 },
        { name: 'Albacore Tuna 500g', price: 28, original_price: 35, discount: 20, rating: 4.4, reviews: 50, image: 'https://via.placeholder.com/200?text=Albacore+Tuna', category_id: 6 },
        { name: 'Bigeye Tuna 400g', price: 42, original_price: 52, discount: 19, rating: 4.7, reviews: 30, image: 'https://via.placeholder.com/200?text=Bigeye+Tuna', category_id: 6 },
        { name: 'Black Tuna 500g', price: 45, original_price: 55, discount: 18, rating: 4.8, reviews: 25, image: 'https://via.placeholder.com/200?text=Black+Tuna', category_id: 6 },
        { name: 'Bonito Tuna 600g', price: 22, original_price: 27, discount: 19, rating: 4.2, reviews: 55, image: 'https://via.placeholder.com/200?text=Bonito+Tuna', category_id: 6 },
        { name: 'Frigate Tuna 500g', price: 25, original_price: 30, discount: 17, rating: 4.3, reviews: 40, image: 'https://via.placeholder.com/200?text=Frigate+Tuna', category_id: 6 },
        { name: 'Bullet Tuna 400g', price: 30, original_price: 37, discount: 19, rating: 4.5, reviews: 35, image: 'https://via.placeholder.com/200?text=Bullet+Tuna', category_id: 6 },
        { name: 'Longtail Tuna 500g', price: 27, original_price: 33, discount: 18, rating: 4.4, reviews: 45, image: 'https://via.placeholder.com/200?text=Longtail+Tuna', category_id: 6 },
        { name: 'Mackerel Fillet 600g', price: 15, original_price: 18, discount: 17, rating: 4.2, reviews: 85, image: 'https://via.placeholder.com/200?text=Mackerel+Fillet', category_id: 6 },
        { name: 'Sardine Fillet 500g', price: 8, original_price: 10, discount: 20, rating: 4.0, reviews: 120, image: 'https://via.placeholder.com/200?text=Sardine+Fillet', category_id: 6 },
        { name: 'Anchovy Fillet 300g', price: 12, original_price: 15, discount: 20, rating: 4.1, reviews: 95, image: 'https://via.placeholder.com/200?text=Anchovy+Fillet', category_id: 6 },
        { name: 'Herring Fillet 500g', price: 14, original_price: 17, discount: 18, rating: 4.3, reviews: 75, image: 'https://via.placeholder.com/200?text=Herring+Fillet', category_id: 6 },
        { name: 'Smoked Salmon 400g', price: 35, original_price: 45, discount: 22, rating: 4.7, reviews: 65, image: 'https://via.placeholder.com/200?text=Smoked+Salmon', category_id: 6 },
        { name: 'Smoked Trout 300g', price: 28, original_price: 35, discount: 20, rating: 4.5, reviews: 55, image: 'https://via.placeholder.com/200?text=Smoked+Trout', category_id: 6 },
        { name: 'Smoked Mackerel 500g', price: 20, original_price: 25, discount: 20, rating: 4.4, reviews: 70, image: 'https://via.placeholder.com/200?text=Smoked+Mackerel', category_id: 6 },
        { name: 'Canned Tuna 200g', price: 3, original_price: 4, discount: 25, rating: 4.0, reviews: 200, image: 'https://via.placeholder.com/200?text=Canned+Tuna', category_id: 6 },
        { name: 'Canned Salmon 200g', price: 5, original_price: 6, discount: 17, rating: 4.2, reviews: 150, image: 'https://via.placeholder.com/200?text=Canned+Salmon', category_id: 6 },
        { name: 'Canned Sardines 125g', price: 2, original_price: 3, discount: 33, rating: 3.9, reviews: 180, image: 'https://via.placeholder.com/200?text=Canned+Sardines', category_id: 6 },
        { name: 'Fish Oil Capsules 1000mg', price: 25, original_price: 30, discount: 17, rating: 4.4, reviews: 120, image: 'https://via.placeholder.com/200?text=Fish+Oil+Capsules', category_id: 6 },
        { name: 'Omega 3 Supplements', price: 30, original_price: 38, discount: 21, rating: 4.5, reviews: 95, image: 'https://via.placeholder.com/200?text=Omega+3+Supplements', category_id: 6 },
        { name: 'Fish Meal 10kg', price: 45, original_price: 55, discount: 18, rating: 4.3, reviews: 80, image: 'https://via.placeholder.com/200?text=Fish+Meal', category_id: 6 },
        { name: 'Fish Emulsion Fertilizer 5L', price: 35, original_price: 45, discount: 22, rating: 4.4, reviews: 65, image: 'https://via.placeholder.com/200?text=Fish+Emulsion+Fertilizer', category_id: 6 },
        { name: 'Shark Cartilage Powder 500g', price: 80, original_price: 100, discount: 20, rating: 4.6, reviews: 30, image: 'https://via.placeholder.com/200?text=Shark+Cartilage', category_id: 6 },
        { name: 'Pearl Powder 100g', price: 150, original_price: 200, discount: 25, rating: 4.8, reviews: 20, image: 'https://via.placeholder.com/200?text=Pearl+Powder', category_id: 6 },
        { name: 'Abalone Meat 200g', price: 120, original_price: 150, discount: 20, rating: 4.9, reviews: 15, image: 'https://via.placeholder.com/200?text=Abalone+Meat', category_id: 6 },
        { name: 'Sea Cucumber 500g', price: 200, original_price: 250, discount: 20, rating: 4.7, reviews: 25, image: 'https://via.placeholder.com/200?text=Sea+Cucumber', category_id: 6 },
        { name: 'Jellyfish 300g', price: 25, original_price: 30, discount: 17, rating: 4.2, reviews: 40, image: 'https://via.placeholder.com/200?text=Jellyfish', category_id: 6 },
        { name: 'Roe Caviar 50g', price: 300, original_price: 400, discount: 25, rating: 5.0, reviews: 10, image: 'https://via.placeholder.com/200?text=Roe+Caviar', category_id: 6 },

      console.log('Seeded products.');
    }
  });

  // Create default admin user
  db.get('SELECT COUNT(*) as count FROM users WHERE role = "admin"', (err, row) => {
    if (err) {
      console.error('Error checking admin user:', err.message);
      return;
    }

    if (row.count === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = bcrypt.hashSync('admin123', 10);

      db.run('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)', ['admin@agrimarket.com', hashedPassword, 'admin'], function(err) {
        if (err) {
          console.error('Error creating admin user:', err.message);
        } else {
          console.log('Created default admin user: admin@agrimarket.com / admin123');
        }
      });
    }
  });
}

module.exports = db;
